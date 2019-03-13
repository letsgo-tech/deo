const express = require('express');
const router = express.Router();

const pathToRegexp = require('path-to-regexp');
const puppeteer = require('puppeteer');
const { TimeoutError } = require('puppeteer/Errors');

const { query } = require('../lib/mysql.js');

router.get("/",async (req, res) =>{
	const { token: project_key, url } = req.query;
    query('SELECT * FROM project WHERE project_key=?', [project_key], (err, vals, fileds) => {
		if (err) {
			res.json({
				status: 500,
				msg: 'internal error',
			});
		} else if (vals.length < 1){
			res.send('no matched project');
		} else {
			const { id, base_url } = vals[0];
			if ( url.indexOf(base_url) < 0 ) {
				res.send('');
				return;
			}

			query('SELECT * FROM rule WHERE project_id=?', [id], async (err, rules, fields) => {
				if (err) {
					res.json({
						status: 500,
						msg: 'internal error',
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
						const html = await load(url, selector, meta, rule.reload)
						res.send(html);
						return;
					} else if (fn) {
						const html = await load(url, eval(fn), meta, rule.reload)
						res.send(html);
						return;
					} else {
						const html = await load(url, millisecond, meta, rule.reload)
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


const load = async (url, rule, meta = '', reload = true) => {
	const browser = await puppeteer.launch({executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox', '--disable-gpu', '--cast-initial-screen-width=6000', '--cast-initial-screen-height=6000'] });

	const page = await browser.newPage();

	page.setViewport({width: 1920, height:1080});

	await page.goto(url, {waitUntil:"networkidle0"});

	if (reload) {
		await page.reload();
	}

	if (rule) {
		try {
			await page.waitFor(rule, { timeout: 15000 });
		} catch (e) {
			if (e instanceof TimeoutError) {
				await browser.close();
				return e;
			}
		}
	}

		let html = await page.content();
		if (meta && meta != 'null') {
			html = html.replace('<head>', '<head>' + meta);
		}

		await browser.close();
		return html;
};

module.exports = router;
