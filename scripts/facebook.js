/*
	This fetches the latest events from the Facebook API for the UniCS page.
*/

const logger = require('pino')();
const axios = require('axios');
const fs = require('fs');

const now = new Date();

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

if (!process.env.FACEBOOK_TOKEN) {
	logger.warn('FACEBOOK_TOKEN was not set in the environment variables. Will use fallback events data.');
	process.exit(0);
}

axios.get(`https://graph.facebook.com/v7.0/me/events?access_token=${process.env.FACEBOOK_TOKEN}`)
	.then(res => {
		logger.info('Successfully fetched data from Facebook');
		const events = res.data.data;
		const upcoming = [];
		const past = [];
		for (const event of events) {
			if (past.length >= 4 || upcoming.length >= 5) break;
			const eventTime = new Date(event.start_time);
			const data = {
				name: event.name,
				date: `${eventTime.getDate()} ${months[eventTime.getMonth()]}`,
				url: `https://www.facebook.com/events/${event.id}`
			};
			if (eventTime >= now) {
				upcoming.unshift(data);
			} else {
				past.push(data);
			}
		}
		fs.writeFileSync('data/events.json', JSON.stringify({
			upcoming,
			past
		}));
		logger.info('Successfully parsed events');
	})
	.catch(err => {
		logger.warn('There was an error fetching events data from Facebook:');
		logger.warn(err);
	});
