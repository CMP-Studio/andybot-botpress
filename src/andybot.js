const axios = require('axios');
const config = require('./config')

module.exports = {
    createUser: async function (page_id, name){ 
        const response = await axios.post(`${config.apiEndpoint}/createUser`,
        { page_id, name },
        { headers: { 'Content-Type': 'application/json'} })

        return response.data;
    },

    userExists: async function (page_id) {
        const response = await axios.post(`${config.apiEndpoint}/userExists`, 
        { page_id },
        { headers: { 'Content-Type': 'application/json'} })
        return Boolean(response.data); 
    },

    getUser: async function (page_id) {
        const response = await axios.post(`${config.apiEndpoint}/getUser`, 
        { page_id },
        { headers: { 'Content-Type': 'application/json'} })
        return response.data; 
    }
}