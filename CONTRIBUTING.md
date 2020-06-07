# Contributing

This guide will help you to run the UniCS website locally.

## Quick Start

- Install [Node.js v12/v14](https://nodejs.org/)
- Install [Netlify CLI](https://www.npmjs.com/package/netlify-cli)
- Set environment variables:
	- `FACEBOOK_TOKEN` - page access token for the UniCS group. Used to fetch events data. If left blank/invalid, the site will build with old events data
	- `SENDGRID_API_KEY` - required for a functioning "Contact Us" email form
	- `RECAPTCHA_SITE_KEY` - the public-facing reCAPTCHA site key
	- `RECAPTCHA_SITE_SECRET` - the reCAPTCHA secret used to validate requests
	- `UNICS_EMAIL` - the email address to send email to
- Install dependencies - `npm i`
- Build the website:
	- Build once: `npm run build`
	- Build once (without updating Facebook events): `npm run build:html`
	- Watch for file changes and build automatically: `npm run build:live`
- Serve the website - `netlify dev`

## Commands

- `npm run build:events` - fetches the latest UniCS events from Facebook
- `npm run build:html` - prepares the output site and compiles the site templates
- `npm run build` - does both of the above
- `npm run build:live` - runs `npm run build:html` when any of the site or data files change
- `npm run serve` - starts a simple HTTP server which hosts the generated output. The email form will not work with this command as it doesn't run any of the lambda functions.
- `netlify dev` - runs the site locally with the lambda functions - the site will run as if it was being hosted on Netlify

## Structure explanation

```
.
├── data
│   ├── committee.json
│   ├── events.json
│   └── gallery.json
├── functions
│   └── email.js
├── scripts
│   ├── build.js
│   └── facebook.js
└── site
    ├── _partials
    └── ...
```

- The `data` files store information about the committee, events and gallery. You should manually update the committee and gallery files, but the events file is automatically generated.
- The `functions` directory stores lambda functions for Netlify. Currently, there is only the `email.js` file to handle sending emails to the committee.
- The `scripts` directory contains build scripts:
	- `facebook.js` - pulls the latest UniCS events from Facebook
	- `build.js` - generates the HTML for the site
- The `site` directory contains the site assets and templates. The templates are .html files that are processed with [Handlebars](https://handlebarsjs.com/) when using the build script. Everything in this directory apart from the `_partials` directory is copied to the root of the deployed site.