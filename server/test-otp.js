const axios = require('axios');

const testOTP = async () => {
  console.log('🧪 Testing OTP System...\n');
  
  const testEmail = 'test' + Date.now() + '@example.com';
  const testData = {
    name: 'Test User',
    email: testEmail,
    password: 'test123456'
  };
  
  try {
    console.log('1️⃣ Sending registration request...');
    const response = await axios.post('http://localhost:5000/api/auth/register', testData);
    
    if (response.data.success) {
      console.log('✅ SUCCESS:', response.data.message);
      console.log('📧 Check email:', testEmail);
      console.log('\n⚠️ Note: This is a test email. For real testing, use your actual email address.');
    } else {
      console.log('❌ FAILED:', response.data);
    }
  } catch (error) {
    console.log('❌ ERROR:', error.response?.data?.error || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Backend server is not running!');
      console.log('   Run: cd server && npm start');
    }
  }
};

console.log('Make sure:');
console.log('1. MongoDB is running');
console.log('2. Backend server is running (cd server && npm start)');
console.log('3. Press Enter to continue...\n');

process.stdin.once('data', () => {
  testOTP();
});
