// database.js - JSON file-based database
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'database.json');

// Initialize database if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  const initialData = {
    users: []
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
  console.log('Database file created');
}

// Read database
function readDB() {
  const data = fs.readFileSync(DB_FILE, 'utf8');
  return JSON.parse(data);
}

// Write to database
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Database API
const db = {
  // Get a user by email
  get: function(query, params, callback) {
    try {
      const data = readDB();
      const field = query.includes('WHERE email') ? 'email' : 'id';
      const value = params[0];
      
      let user = null;
      if (query.includes('AND password')) {
        // This is a login query
        const password = params[1];
        user = data.users.find(u => u[field] === value && u.password === password);
      } else {
        // This is a query by email only
        user = data.users.find(u => u[field] === value);
      }
      
      callback(null, user);
    } catch (error) {
      callback(error, null);
    }
  },
  
  // Insert a new user
  run: function(query, params, callback) {
    try {
      const data = readDB();
      
      if (query.includes('INSERT INTO users')) {
        const [name, email, password] = params;
        const newUser = {
          id: Date.now(), // Use timestamp as ID
          name,
          email,
          password
        };
        
        data.users.push(newUser);
        writeDB(data);
        
        // Mimic the lastID property that SQLite would provide
        if (callback && typeof callback === 'function') {
          callback.call({ lastID: newUser.id });
        }
      }
    } catch (error) {
      console.error('Database error:', error);
      if (callback && typeof callback === 'function') {
        callback.call(null, error);
      }
    }
  }
};

module.exports = db;