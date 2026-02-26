// test-api.js
const axios = require('axios');

async function testAPI() {
    try {
        // Test GET request
        console.log('Testing GET /api/bookmarks...');
        const getResponse = await axios.get('http://localhost:5001/api/bookmarks');
        console.log('✅ GET successful:', getResponse.data);
        
        // Test POST request
        console.log('\nTesting POST /api/bookmarks...');
        const postResponse = await axios.post('http://localhost:5001/api/bookmarks', {
            title: 'Test Bookmark',
            url: 'https://example.com'
        });
        console.log('✅ POST successful:', postResponse.data);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Server response:', error.response.data);
        }
    }
}

testAPI();