# Contributing

## Quick Start

- Install [Node.js v12/v14](https://nodejs.org/)
- Set environment variables:
	- `FACEBOOK_TOKEN` - page access token for the UniCS group. Used to fetch events data. If left blank/invalid, the site will build with old events data
	- `SENDGRID_API_KEY` - required for a functioning "Contact Us" email form
	- `RECAPTCHA_SITE_KEY` - the public-facing reCAPTCHA site key
	- `RECAPTCHA_SITE_SECRET` - the reCAPTCHA secret used to validate requests
- Install dependencies - `npm i`
- Build the website - `npm run build`
- Serve the website (doesn't support email form) - `npx http-server dist`