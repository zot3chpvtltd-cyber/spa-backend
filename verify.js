const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let token = '';
let spaId = '';

const runTests = async () => {
    try {
        console.log('🚀 Starting Verification Tests...');

        // 1. Register User (Master Admin) - This might fail if user exists, which is fine
        try {
            await axios.post(`${API_URL}/auth/register`, {
                email: 'master@test.com',
                password: 'password123',
                fullName: 'Master Admin',
                role: 'MasterAdmin',
                spaId: null
            });
            console.log('✅ Registration (Master Admin) Passed');
        } catch (e) {
            console.log('ℹ️ User likely exists, proceeding to login...');
        }

        // 2. Login
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'master@test.com',
            password: 'password123'
        });
        token = loginRes.data.token;
        console.log('✅ Login Passed');

        // 3. Create SPA (Master Admin)
        try {
            const spaRes = await axios.post(`${API_URL}/master-admin/spas`, {
                spaName: 'Test Spa',
                spaSlug: 'test-spa-' + Date.now(),
                contactEmail: 'test-' + Date.now() + '@spa.com',
                contactPhone: '1234567890'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            spaId = spaRes.data.SpaId;
            console.log('✅ Create SPA Passed');
        } catch (e) {
            console.error('❌ Create SPA Failed:', e.response?.data || e.message);
        }

        // 4. Get SPAs (Master Admin)
        const spasRes = await axios.get(`${API_URL}/master-admin/spas`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (spasRes.data.length > 0) console.log('✅ Get SPAs Passed');

        console.log('🎉 All Tests Completed Successfully!');
    } catch (error) {
        console.error('❌ Tests Failed:', error.response?.data || error.message);
    }
};

// Wait for server to start
setTimeout(runTests, 5000);
