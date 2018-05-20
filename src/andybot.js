const axios = require('axios');
const config = require('./config');

module.exports = {
	createUser: async function (page_id, name){ 
		const response = await axios.post(`${config.apiEndpoint}/createUser`,
			{ page_id, name },
			{ headers: { 'Content-Type': 'application/json'} });

		return response.data;
	},

	userExists: async function (page_id) {
		const response = await axios.post(`${config.apiEndpoint}/userExists`, 
			{ page_id },
			{ headers: { 'Content-Type': 'application/json'} });
		return Boolean(response.data); 
	},

	getUser: async function (page_id) {
		const response = await axios.post(`${config.apiEndpoint}/getUser`, 
			{ page_id },
			{ headers: { 'Content-Type': 'application/json'} });
		return response.data; 
	},


	avaliableActivities: async function (page_id) {
		const response = await axios.post(`${config.apiEndpoint}/avaliableActivities`,
			{ page_id },
			{ headers: { 'Content-Type': 'application/json'} }
		);
		return response.data;
	},


	trivia: {

		submitScore: async function(fb_page_id, activity_id, correct, total) {
			const rsp = await axios.post(`${config.apiEndpoint}/trivia/submitScore`, 
				{ fb_page_id, activity_id, correct, total },
				{ headers: { 'Content-Type': 'application/json'} });
			return rsp.data; 
		}
	},

	achievement: {
		
		progress: async function(fb_page_id) {
			const rsp = await axios.post(`${config.apiEndpoint}/achievement/progress`, 
				{ fb_page_id },
				{ headers: { 'Content-Type': 'application/json'} });
			return rsp.data; 
		}
	},

	poll: {

		submitResponse: async function(fb_page_id, activity_id, question_number, answer) {
			const rsp = await axios.post(`${config.apiEndpoint}/poll/submitResponse`, 
				{ fb_page_id, activity_id, question_number, answer },
				{ headers: { 'Content-Type': 'application/json'} });
			return rsp.data; 
		},

		getResponsesForQuestion: async function(activity_id, question_number) {
			const rsp = await axios.post(`${config.apiEndpoint}/poll/getResponsesForQuestion`, 
				{ activity_id, question_number },
				{ headers: { 'Content-Type': 'application/json'} });
			return rsp.data; 
		}


	},

	scan: {
		scanCode: async function(fb_page_id, ref) {
			const rsp = await axios.post(`${config.apiEndpoint}/scan/scanCode`, 
			{ page_id: fb_page_id, ref },
			{ headers: { 'Content-Type': 'application/json'} });
			return rsp.data; 		
		}
	},

	scavengerhunt: {
		getHint: async function( clue_number ) {
			const rsp = await axios.post(`${config.apiEndpoint}/scavengerhunt/getHint`, 
			{ clue_number },
			{ headers: { 'Content-Type': 'application/json'} });
			return rsp.data; 			
		}
	}

};
