const axios = require('axios');

const GEMINI_API_KEY = 'AIzaSyCcW7AcozuL0qV1aXk-md4W_KBHBEODFwM';
const GEMINI_PRO_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

async function testGemini() {
  console.log('Testing Gemini API...\n');
  
  try {
    const response = await axios.post(GEMINI_PRO_URL, {
      contents: [{ 
        parts: [{ text: 'Say "Hello, Gemini API is working!" in one sentence.' }] 
      }]
    });

    const result = response.data.candidates[0].content.parts[0].text;
    console.log('✅ SUCCESS! Gemini API Response:');
    console.log(result);
    console.log('\n✅ API Key is working correctly!');
  } catch (error) {
    console.log('❌ ERROR:', error.response?.data || error.message);
    console.log('\n❌ API Key is NOT working!');
  }
}

testGemini();
