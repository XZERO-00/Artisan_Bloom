const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.serialize(() => {
      // Users
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        password_hash TEXT,
        role TEXT,
        shopName TEXT,
        shopBio TEXT,
        avatar TEXT,
        phone TEXT,
        isApproved BOOLEAN DEFAULT 1,
        isBanned BOOLEAN DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Products
      db.run(`CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        vendorId TEXT,
        name TEXT,
        description TEXT,
        price REAL,
        stock INTEGER,
        category TEXT,
        tags TEXT,
        images TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(vendorId) REFERENCES users(id)
      )`);

      // Orders
      db.run(`CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        userId TEXT,
        total REAL,
        shipping TEXT,
        paymentMethod TEXT,
        status TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id)
      )`);

      // Order Items
      db.run(`CREATE TABLE IF NOT EXISTS order_items (
        id TEXT PRIMARY KEY,
        orderId TEXT,
        productId TEXT,
        vendorId TEXT,
        quantity INTEGER,
        price REAL,
        platformFee REAL,
        vendorEarnings REAL,
        FOREIGN KEY(orderId) REFERENCES orders(id),
        FOREIGN KEY(productId) REFERENCES products(id),
        FOREIGN KEY(vendorId) REFERENCES users(id)
      )`);

      // Chat Threads
      db.run(`CREATE TABLE IF NOT EXISTS chat_threads (
        id TEXT PRIMARY KEY,
        customerId TEXT,
        customerName TEXT,
        vendorId TEXT,
        vendorName TEXT,
        productId TEXT,
        productName TEXT,
        unreadByVendor INTEGER DEFAULT 0,
        unreadByCustomer INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        lastMessageAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Chat Messages
      db.run(`CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY,
        threadId TEXT,
        senderId TEXT,
        senderName TEXT,
        text TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(threadId) REFERENCES chat_threads(id)
      )`);

      // Platform Earnings
      db.run(`CREATE TABLE IF NOT EXISTS platform_earnings (
        id TEXT PRIMARY KEY,
        orderId TEXT,
        vendorId TEXT,
        totalAmount REAL,
        platformCommission REAL,
        vendorNet REAL,
        date TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
    });
  }
});

module.exports = db;
