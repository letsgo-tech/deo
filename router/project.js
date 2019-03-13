const express = require('express');
const router = express.Router();

const { query } = require('../lib/mysql.js');
const uuidv1 = require('uuid/v1');
const generate = require('nanoid/generate');

const moment = require('moment');

router.get('/:id', (req, res) => {
	const { id } = req.params;
	query('SELECT * FROM project WHERE id=?', [id], (err, vals, fileds) => {
		if (err) {
			res.json({
				status: 500,
				msg: 'internal error',
			});
		} else if (vals.length > 0){
			query('SELECT * FROM rule WHERE project_id=? ORDER BY created DESC', [id], (err, rules, fields) => {
				if (err) {
					res.json({
						status: 500,
						msg: 'internal error',
					});
				} else {
					const data = vals[0];
					data.rules = rules;
					res.json({
						status: 200,
						data
					});
				}
			});
		} else {
			res.json({
				status: 404,
				msg: 'no such record'
			});
		}
	})
});

router.get('/:id/key', (req, res) => {
	const { id } = req.params;
	const project_key = uuidv1();
	const time = moment().format("YYYY-MM-DD h:mm:ss");
	query('UPDATE project SET project_key=?, updated=? WHERE id=?', [project_key, time, id], (err, vals, fileds) => {
		if (err) {
			res.json({
				status: 500,
				msg: 'internal error',
			});
		} else {
			res.json({
				status: 200,
				data: project_key
			});
		}
	})
});

router.post('/:id/name', (req, res) => {
	const { id } = req.params;
	const { project_name } = req.body;
	const time = moment().format("YYYY-MM-DD h:mm:ss");
	query('UPDATE project SET project_name=?, updated=? WHERE id=?', [project_name, time, id], (err, vals, fileds) => {
		if (err) {
			res.json({
				status: 500,
				msg: 'internal error',
			});
		} else {
			res.json({
				status: 200,
				data: project_name
			});
		}
	})
});

router.post('/:id/base', (req, res) => {
	const { id } = req.params;
	const { base_url } = req.body;
	const time = moment().format("YYYY-MM-DD h:mm:ss");
	query('UPDATE project SET base_url=?, updated=? WHERE id=?', [base_url, time, id], (err, vals, fileds) => {
		if (err) {
			res.json({
				status: 500,
				msg: 'internal error',
			});
		} else {
			res.json({
				status: 200,
				data: base_url
			});
		}
	})
});

module.exports = router;