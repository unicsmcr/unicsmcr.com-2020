const Handlebars = require('handlebars');
const fs = require('fs-extra');
const logger = require('pino')();
const htmlMinify = require('html-minifier').minify;
const klaw = require('klaw');
const path = require('path');
const CleanCSS = require('clean-css');

async function analyseSite() {
	const partials = [];
	const html = [];
	const stylesheets = [];
	for await (const file of klaw('site')) {
		const isFile = file.stats.isFile();
		const filepath = path.relative(`${process.cwd()}/site`, file.path);
		if (!isFile) continue;
		if (filepath.includes('_partials')) {
			partials.push(path.basename(filepath, '.html'));
		} else if (path.extname(filepath) === '.html') {
			html.push(filepath);
		} else if (path.extname(filepath) === '.css') {
			stylesheets.push(filepath);
		}
	}
	return { partials, html, stylesheets };
}

function registerPartial(partial) {
	const template = Handlebars.compile(fs.readFileSync(`site/_partials/${partial}.html`, {
		encoding: 'utf8'
	}));
	Handlebars.registerPartial(partial, template);
}

function compileHTML(file, data) {
	const template = Handlebars.compile(fs.readFileSync(`site/${file}`, {
		encoding: 'utf8'
	}));
	const populated = template(data);
	const minified = htmlMinify(populated, {
		collapseInlineTagWhitespace: true,
		collapseWhitespace: true,
		conservativeCollapse: true,
		minifyCSS: true,
		minifyJS: true
	});
	fs.writeFileSync(`dist/${file}`, minified);
}

function minifyCSS(file) {
	const input = fs.readFileSync(`site/${file}`, { encoding: 'utf8' });
	const output = new CleanCSS({ level: 2 }).minify(input);
	fs.writeFileSync(`dist/${file}`, output.styles);
}

async function build() {
	// Load data
	const data = {
		committee: require('../data/committee.json'),
		gallery: require('../data/gallery.json'),
		events: require('../data/events.json'),
		RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
		year: new Date().getFullYear()
	};
	if (!data.RECAPTCHA_SITE_KEY) {
		logger.warn('RECAPTCHA_SITE_KEY is not set in the env variables - the email form will not work');
	}
	logger.info('Loaded data');

	// Empty dist
	// fs.emptyDirSync('dist/');
	// logger.info('Emptied dist/');
	
	// Copy site files
	fs.copySync('site', 'dist', {
		filter(path) {
			return !path.includes('_partials');
		}
	});
	logger.info('Copied site files');

	const { partials, html, stylesheets } = await analyseSite();
	// Register partials
	for (const partial of partials) {
		try {
			registerPartial(partial);
			logger.info(`Registered partial: ${partial}`);
		} catch(err) {
			logger.warn(`Error registering partial ${partial}`);
			logger.error(err);
			process.exit(1);
		}
	}
	// Compile HTML
	for (const file of html) {
		try {
			compileHTML(file, data);
			logger.info(`Compiled ${file}`);
		} catch (err) {
			logger.warn(`Error compiling HTML ${file}`);
			logger.error(err);
			process.exit(1);
		}
	}
	// Minify CSS
	for (const stylesheet of stylesheets) {
		try {
			minifyCSS(stylesheet);
			logger.info(`Minified ${stylesheet}`);
		} catch (err) {
			logger.warn(`Error minifying ${stylesheet}`);
			logger.error(err);
			process.exit(1);
		}
	}
	logger.info('Done!');
}

build();
