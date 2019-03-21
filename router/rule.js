const express = require('express');
const router = express.Router();

const { query } = require('../lib/mysql.js');
const generate = require('nanoid/generate');

const moment = require('moment');

router.post('/', (req, res) => {

	const { project_id, path, meta, selector, fn, millisecond, reload = 0, noscript = 0 } = req.body;

	query('SELECT * FROM project WHERE id = ?', [project_id], (err, projects, fileds) => {
		if (err) {
			res.json({
				status: 500,
				msg: 'connect db failed',
			});
		} else if (projects.length > 0){
			query('SELECT * FROM rule WHERE path = ?', path, (err, rules, fileds) => {
				if (err) {
					res.json({
						status: 500,
						msg: 'connect db failed',
					});
				} else if (rules.length > 0){
					res.json({
						status: 500,
						msg: 'path already exists',
					})
				} else {
					const id = generate('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)
					const time = moment().format("YYYY-MM-DD h:mm:ss");
					const rule = {
						id,
						project_id,
						path,
						meta,
						selector,
						fn,
						millisecond,
						reload,
						noscript,
						created: time,
						updated: time
					}
					query('INSERT INTO rule SET ?', rule, (err, rules, fileds) => {
						if (err) {
							res.json({
								status: 500,
								msg: 'internal error',
							});
						} else {
							res.json({
								status: 200,
								data: rule,
							})
						}
					});
				}
			});
		} else {
			res.json({
				status: 404,
				msg: 'no such project'
			})
		}
	});
});

router.patch('/:id', (req, res) => {
	const { id } = req.params;
	const { path, meta, selector, fn, millisecond, reload=0, noscript=0 } = req.body;
	const time = moment().format("YYYY-MM-DD h:mm:ss");
	query('UPDATE rule SET path=?, meta=?, selector=?, fn=?, millisecond=?, reload=?, noscript=?, updated=?  WHERE id=?', [path, meta, selector, fn, millisecond, reload, noscript, time, id], (err, rules, fileds) => {
		if (err) {
			res.json({
				status: 500,
				msg: 'update rule failed',
			});
		} else {
			res.json({
				status: 200,
				msg: 'ok',
			})
		}
	});
});

router.delete('/:id', (req, res) => {
	const { id } = req.params;
	query('DELETE FROM rule WHERE id=?', [id], (err, vals, fileds) => {
		if (err) {
			res.json({
				status: 500,
				msg: 'delete rule failed',
			});
		} else {
			res.json({
				status: 200,
				msg: 'ok'
			})
		}
	});
});

module.exports = router;