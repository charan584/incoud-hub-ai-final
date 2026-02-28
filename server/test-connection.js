const mongoose = require('mongoose');
require('dotenv').config();

console.log('🧪 Testing Database Connection...\n');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/incloudhub';

console.log('MongoDB URI:', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    console.log('📍 Database:', mongoose.connection.name);
    console.log('🔗 Host:', mongoose.connection.host);
    console.log('\n✅ Database is working! You can now start the server.');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('\n💡 Solutions:');
    console.log('1. Start MongoDB: Run START_MONGODB.bat');
    console.log('2. Or start MongoDB service: net start MongoDB (as Admin)');
    console.log('3. Or use MongoDB Atlas (cloud database)');
    process.exit(1);
  });
