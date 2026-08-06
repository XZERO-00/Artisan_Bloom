const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const { v4: uuidv4 } = require('uuid');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads'));
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_for_craftnest_123';

// ─── MIDDLEWARE ────────────────────────────────────────────────────────────

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// ─── AUTH ENDPOINTS ────────────────────────────────────────────────────────

app.post('/api/auth/register', async (req, res) => {
  const { email, password, fullName, phone, role = 'customer', shopName = '', shopBio = '' } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get('SELECT email FROM users WHERE email = ?', [email], async (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (row) return res.status(400).json({ error: 'Email already in use' });

    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const uid = 'usr_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
      
      const finalShopName = role === 'vendor' ? (shopName || `${fullName}'s Shop`) : null;
      const finalShopBio = role === 'vendor' ? (shopBio || '') : null;
      const isAdmin = email === 'avp.studio7660@gmail.com' ? 'admin' : role;

      db.run(
        'INSERT INTO users (id, name, email, password_hash, role, shopName, shopBio, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [uid, fullName, email, hash, isAdmin, finalShopName, finalShopBio, phone || ''],
        (insertErr) => {
          if (insertErr) return res.status(500).json({ error: 'Failed to create user' });
          
          const token = jwt.sign({ uid, email, role: isAdmin }, JWT_SECRET, { expiresIn: '7d' });
          res.status(201).json({ success: true, token });
        }
      );
    } catch (hashErr) {
      res.status(500).json({ error: 'Failed to process password' });
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(400).json({ error: 'Account not found.' });
    if (user.isBanned) return res.status(403).json({ error: 'Account suspended.' });

    try {
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) return res.status(400).json({ error: 'Invalid credentials.' });

      const token = jwt.sign({ uid: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      res.status(200).json({ success: true, token });
    } catch (authErr) {
      res.status(500).json({ error: 'Login process failed.' });
    }
  });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  db.get('SELECT id as uid, name, email, role, shopName, shopBio, avatar, phone, isApproved, isBanned, createdAt FROM users WHERE id = ?', [req.user.uid], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(404).json({ error: 'User not found' });
    // Convert SQLite 1/0 boolean back to JS boolean
    user.isApproved = !!user.isApproved;
    user.isBanned = !!user.isBanned;
    res.json(user);
  });
});

app.get('/api/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
  db.all('SELECT id as uid, name, email, role, shopName, isApproved, isBanned, createdAt FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    const mapped = rows.map(r => ({ ...r, isApproved: !!r.isApproved, isBanned: !!r.isBanned }));
    res.json(mapped);
  });
});

app.patch('/api/users/:id/status', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
  const { isApproved, isBanned } = req.body;
  const updates = [];
  const params = [];
  if (isApproved !== undefined) { updates.push('isApproved = ?'); params.push(isApproved ? 1 : 0); }
  if (isBanned !== undefined) { updates.push('isBanned = ?'); params.push(isBanned ? 1 : 0); }
  
  if (updates.length === 0) return res.status(400).json({ error: 'No updates provided' });
  params.push(req.params.id);

  db.run(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params, function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ success: true });
  });
});

// ─── UPLOADS ───────────────────────────────────────────────────────────────

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const fileUrl = `http://localhost:${process.env.PORT || 3001}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// ─── PRODUCTS ──────────────────────────────────────────────────────────────

app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    rows.forEach(r => { try { r.images = JSON.parse(r.images); } catch(e){ r.images = []; } });
    res.json(rows);
  });
});

app.get('/api/products/vendor/:vendorId', (req, res) => {
  db.all('SELECT * FROM products WHERE vendorId = ?', [req.params.vendorId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    rows.forEach(r => { try { r.images = JSON.parse(r.images); } catch(e){ r.images = []; } });
    res.json(rows);
  });
});

app.post('/api/products', authenticateToken, (req, res) => {
  if (req.user.role !== 'vendor') return res.status(403).json({ error: 'Only vendors can create products' });
  const { name, description, price, stock, category, tags = '[]', images = '[]' } = req.body;
  const id = 'prod_' + uuidv4();
  db.run('INSERT INTO products (id, vendorId, name, description, price, stock, category, tags, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, req.user.uid, name, description, price, stock, category, typeof tags === 'string' ? tags : JSON.stringify(tags), typeof images === 'string' ? images : JSON.stringify(images)],
    (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.status(201).json({ id, name, description, price, stock, category });
    });
});

app.delete('/api/products/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'vendor') return res.status(403).json({ error: 'Unauthorized' });
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ success: true });
  });
});


// ─── ORDERS ────────────────────────────────────────────────────────────────

app.post('/api/orders', authenticateToken, (req, res) => {
  const { items, total, shipping, paymentMethod } = req.body;
  const orderId = 'ord_' + uuidv4();
  
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    db.run('INSERT INTO orders (id, userId, total, shipping, paymentMethod, status) VALUES (?, ?, ?, ?, ?, ?)',
      [orderId, req.user.uid, total, JSON.stringify(shipping), paymentMethod, 'Processing']);

    items.forEach(item => {
      const itemId = 'item_' + uuidv4();
      db.run('INSERT INTO order_items (id, orderId, productId, vendorId, quantity, price, platformFee, vendorEarnings) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [itemId, orderId, item.id, item.vendorId, item.quantity, item.price, item.platformFee || 0, item.vendorEarnings || 0]);
        
      if (item.vendorId) {
        db.run('INSERT INTO platform_earnings (id, orderId, vendorId, totalAmount, platformCommission, vendorNet, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
          ['earn_' + uuidv4(), orderId, item.vendorId, item.price * item.quantity, item.platformFee || 0, item.vendorEarnings || 0, new Date().toISOString()]);
      }
    });

    db.run('COMMIT', (err) => {
      if (err) return res.status(500).json({ error: 'Transaction failed' });
      
      // Notify via Socket.io
      io.emit('new_order', { orderId, userId: req.user.uid });
      res.status(201).json({ success: true, orderId });
    });
  });
});

app.get('/api/orders', authenticateToken, (req, res) => {
  let q, params;
  if (req.user.role === 'admin') {
    q = 'SELECT * FROM orders ORDER BY createdAt DESC';
    params = [];
  } else if (req.user.role === 'vendor') {
    q = 'SELECT DISTINCT o.* FROM orders o JOIN order_items i ON o.id = i.orderId WHERE i.vendorId = ? ORDER BY o.createdAt DESC';
    params = [req.user.uid];
  } else {
    q = 'SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC';
    params = [req.user.uid];
  }

  db.all(q, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    
    // Fetch items for each order
    const orderPromises = rows.map(order => {
      return new Promise((resolve) => {
        order.shipping = JSON.parse(order.shipping || '{}');
        order.date = order.createdAt;
        db.all('SELECT * FROM order_items WHERE orderId = ?', [order.id], (err, items) => {
          order.items = items || [];
          resolve(order);
        });
      });
    });

    Promise.all(orderPromises).then(orders => res.json(orders));
  });
});

app.patch('/api/orders/:id/status', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'vendor') return res.status(403).json({ error: 'Unauthorized' });
  const { status } = req.body;
  db.run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    io.emit('order_status_update', { orderId: req.params.id, status });
    res.json({ success: true });
  });
});

// ─── EARNINGS ──────────────────────────────────────────────────────────────

app.get('/api/earnings', authenticateToken, (req, res) => {
  let q = 'SELECT * FROM platform_earnings';
  let params = [];
  if (req.user.role === 'vendor') {
    q += ' WHERE vendorId = ?';
    params.push(req.user.uid);
  }
  q += ' ORDER BY createdAt ASC';
  
  db.all(q, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows || []);
  });
});


// ─── CHAT ──────────────────────────────────────────────────────────────────

app.get('/api/chat/threads', authenticateToken, (req, res) => {
  const roleField = req.user.role === 'vendor' ? 'vendorId' : 'customerId';
  db.all(`SELECT * FROM chat_threads WHERE ${roleField} = ? ORDER BY lastMessageAt DESC`, [req.user.uid], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

app.post('/api/chat/threads', authenticateToken, (req, res) => {
  const { customerId, customerName, vendorId, vendorName, productId, productName } = req.body;
  const threadId = `${customerId}_${vendorId}_${productId}`;
  
  db.get('SELECT * FROM chat_threads WHERE id = ?', [threadId], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (row) return res.json({ threadId }); // Already exists
    
    db.run('INSERT INTO chat_threads (id, customerId, customerName, vendorId, vendorName, productId, productName) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [threadId, customerId, customerName, vendorId, vendorName, productId, productName], (insertErr) => {
        if (insertErr) return res.status(500).json({ error: 'Database error' });
        res.status(201).json({ threadId });
      });
  });
});

app.get('/api/chat/threads/:id/messages', authenticateToken, (req, res) => {
  db.all('SELECT * FROM chat_messages WHERE threadId = ? ORDER BY timestamp ASC', [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

app.post('/api/chat/threads/:id/messages', authenticateToken, (req, res) => {
  const { text, senderName, senderRole } = req.body;
  const threadId = req.params.id;
  const senderId = req.user.uid;
  const msgId = 'msg_' + uuidv4();

  db.run('INSERT INTO chat_messages (id, threadId, senderId, senderName, text) VALUES (?, ?, ?, ?, ?)',
    [msgId, threadId, senderId, senderName, text], (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      
      const unreadField = senderRole === 'customer' ? 'unreadByVendor' : 'unreadByCustomer';
      db.run(`UPDATE chat_threads SET lastMessageAt = CURRENT_TIMESTAMP, ${unreadField} = ${unreadField} + 1 WHERE id = ?`, [threadId]);

      const newMsg = { id: msgId, threadId, senderId, senderName, text, timestamp: new Date().toISOString() };
      io.emit(`chat_message_${threadId}`, newMsg);
      res.status(201).json(newMsg);
    });
});

app.post('/api/chat/threads/:id/read', authenticateToken, (req, res) => {
  const { role } = req.body;
  const unreadField = role === 'vendor' ? 'unreadByVendor' : 'unreadByCustomer';
  db.run(`UPDATE chat_threads SET ${unreadField} = 0 WHERE id = ?`, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ success: true });
  });
});

// ─── SOCKET.IO CONNECTIONS ─────────────────────────────────────────────────

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// ─── START SERVER ──────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});
