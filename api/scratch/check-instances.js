const axios = require('axios');

async function check() {
  const baseUrl = 'https://evolution.nooage.com.br';
  const apiKey = '429683C4C977415CAAFCCE10F7D57E11';

  try {
    const response = await axios.get(`${baseUrl}/instance/fetchInstances`, {
      headers: { apikey: apiKey }
    });
    console.log('Instances:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

check();
