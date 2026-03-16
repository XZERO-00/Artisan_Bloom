import bcrypt from 'bcryptjs';

const USERS_DB_KEY = 'artisan_bloom_users';

// Helper to get users from localStorage
const getUsers = () => {
  const usersStr = localStorage.getItem(USERS_DB_KEY);
  return usersStr ? JSON.parse(usersStr) : [];
};

// Helper to save users to localStorage
const saveUsers = (users) => {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
};

export const authService = {
  // Register a new user
  register: async (userData) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = getUsers();
    
    // Check if email already exists
    if (users.some(u => u.email === userData.email)) {
      throw new Error('This email is already registered.');
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(userData.password, salt);

    // Create new user record
    const newUser = {
      id: Date.now().toString(),
      name: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      password_hash,
      created_at: new Date().toISOString()
    };

    // Save
    users.push(newUser);
    saveUsers(users);

    return { success: true, message: 'Registration successful!' };
  },

  // Login a user
  login: async (email, password) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    // Verify password
    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    // Generate mock JWT token
    const token = btoa(JSON.stringify({ userId: user.id, email: user.email, exp: Date.now() + 86400000 })); // Base64 encoded payload

    return {
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    };
  },

  // Simulate Password Reset
  resetPassword: async (email) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email exists to avoid leaking info in a real app this might just return success anyway
    const users = getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      // For security, often say 'If a matching account was found, an email was sent'
      throw new Error('If a matching account was found, an email was sent.');
    }

    return { success: true, message: 'Password reset link sent to your email.' };
  }
};
