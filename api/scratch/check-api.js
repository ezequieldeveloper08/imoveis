const axios = require('axios');

async function checkApi() {
  try {
    const response = await axios.get('http://localhost:3001/conversations');
    console.log('Conversations:', response.data);
  } catch (error) {
    console.error('API Error:', error.message);
  }
}

checkApi();
