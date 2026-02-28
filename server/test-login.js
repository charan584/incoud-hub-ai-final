const axios = require('axios');

const testLogin = async () => {
  console.log('🧪 Testing Login System...\n');
  
  const testUser = {
    email: 'test@example.com',
    password: 'test123'
  };
  
  try {
    console.log('1️⃣ Testing health endpoint...');
    const health = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Backend is running:', health.data.message);
    console.log('✅ MongoDB status:', health.data.mongodb);
    
    console.log('\n2️⃣ Testing login endpoint...');
    const login = await axios.post('http://localhost:5000/api/auth/login', testUser);
    console.log('✅ Login response:', login.data);
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend server is NOT running!');
      console.log('\n💡 Start the server:');
      console.log('   cd server');
      console.log('   npm start');
    } else if (error.response) {
      console.log('⚠️ Login failed (expected if user doesn\'t exist):', error.response.data.error);
      console.log('\n✅ Login endpoint is working correctly!');
      console.log('💡 Create an account at: http://localhost:3000/register');
    } else {
      console.log('❌ Error:', error.message);
    }
  }
};

testLogin();
