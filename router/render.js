const express = require('express');
const router = express.Router();

const pathToRegexp = require('path-to-regexp');
const puppeteer = require('puppeteer');
const { TimeoutError } = require('puppeteer/Errors');

const logger = require('../lib/logger.js').logger('deo_render');

const { query } = require('../lib/mysql.js');

router.get("/",async (req, res) =>{
	const { headers, method, originalUrl } = req;
	const logInfo = { headers, method, originalUrl, query: req.query};
	logger.trace(JSON.stringify(logInfo));

	let { token: project_key, url } = req.query;
    query('SELECT * FROM project WHERE project_key=?', [project_key], (err, vals, fileds) => {
		if (err) {
			res.json({
				status: 500,
				msg: 'connect db failed',
			});
		} else if (vals.length < 1){
			res.send('no matched project');
		} else {
			const { id, base_url } = vals[0];
			if ( url.indexOf(base_url) < 0 ) {
				res.send('check your base url');
				return;
			}

			query('SELECT * FROM rule WHERE project_id=?', [id], async (err, rules, fields) => {
				if (err) {
					res.json({
						status: 500,
						msg: 'connect db failed',
					});
				} else if (rules.length > 0) {
					let rule;
					for (let i = 0; i < rules.length; i++) {
						const { path } = rules[i];
						const reg = pathToRegexp(base_url + path);
						if (url.match(reg)) {
							rule = rules[i];
							break;
						}
					}

					if (!rule) {
						const html = await load(url, '', '', false)
						res.send(html);
						return;
					}
					const { meta, selector, fn, millisecond } = rule;

					if (selector) {
						const html = await load(url, selector, meta, rule)
						res.send(html);
						return;
					} else if (fn) {
						const html = await load(url, eval(fn), meta, rule)
						res.send(html);
						return;
					} else {
						const html = await load(url, millisecond, meta, rule)
						res.send(html);
					}
				} else {
					const html = await load(url, '', '', false)
					res.send(html);
					return;
				}
			});
		}
	});
})

let browser;

const load = async (url, term, meta, rule = {}) => {
	try {
		if (!browser) {
			if (process.env.NODE_ENV === 'development') {
				browser = await puppeteer.launch({headless: false, args: ['--no-sandbox', '--disable-gpu', '--cast-initial-screen-width=6000', '--cast-initial-screen-height=6000'] });
			} else {
				browser = await puppeteer.launch({executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox', '--disable-gpu', '--cast-initial-screen-width=6000', '--cast-initial-screen-height=6000'] });
			}

			browser.on('disconnected', () => {
				browser.close();
				browser = null;
			});
		}
	} catch (e) {
		logger.error('engage chrome failed');
		return 'render failed';
	}

	let page = await browser.newPage();
	await page.setUserAgent('deo');
	await page.setViewport({width: 1920, height:1080});

	try {
		await page.goto(url, {waitUntil:"networkidle0"});
	} catch (e) {
		logger.error('access url failed: ' + url);
		return 'render failed';
	}

	if (rule.reload) {
		await page.reload();
	}

	if (term) {
		try {
			await page.waitFor(term, { timeout: 15000 });
		} catch (e) {
			if (e instanceof TimeoutError) {
				page.close();
				logger.error('access page timeout: ' + url);
				return e;
			}
		}
	}

	let html = await page.content();
	if (meta && meta != 'null') {
		html = html.replace('<head>', '<head>' + meta);
	}

	if (rule.noscript) {
		html = html.replace(/(<script.*?>.*?<\/script>)/g, '');
	}

	page.close();
	return html;
};

module.exports = router;
