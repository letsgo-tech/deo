const express = require('express');
const router = express.Router();

const { query } = require('../lib/mysql.js');
const uuidv1 = require('uuid/v1');

const generate = require('nanoid/generate');

const moment = require('moment');

router.get('/', (req, res) => {
	query('SELECT * FROM project ORDER BY created DESC', (err, vals, fileds) => {
		if (err) {
			res.json({
				status: 500,
				msg: 'internal error',
			});
		} else {
			res.json({
				status: 200,
				data: vals
			});
		}
	})
});

router.post('/', (req, res) => {
	const { project_name, base_url } = req.body;
	query('SELECT * FROM project WHERE project_name = ?', [project_name, base_url], (err, vals, fileds) => {
		if (err) {
			res.json({
				status: 500,
				msg: 'connect db failed',
			});
		} else if (vals.length > 0){
			res.json({
				status: 500,
				msg: 'project name already exists',
			});
		} else {
			const id = generate('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)
			const project_key = uuidv1();
			const time = moment().format("YYYY-MM-DD h:mm:ss");
			const project = {
				id,
				project_name,
				base_url,
				project_key,
				created: time,
				updated: time
			}
			query('INSERT INTO project SET ?', project, (err, vals, fileds) => {
				if (err) {
					res.json({
						status: 500,
						msg: 'add project failed',
					});
				} else {
					res.json({
						status: 200,
						data: project,
					})
				}
			});
		}
	});
});

router.delete('/:id', (req, res) => {
	const { id } = req.params;
	query('DELETE FROM rule WHERE project_id=?', [id], (err, vals, fileds) => {
		if (err) {
			res.json({
				status: 500,
				msg: 'connect db failed',
			});
		} else {
			query('DELETE FROM project WHERE id=?', [id], (err, vals, fileds) => {
				if (err) {
					res.json({
						status: 500,
						msg: 'delete project failed',
					});
				} else {
					res.json({
						status: 200,
						msg: 'ok'
					})
				}
			});
		}
	})
});

module.exports = router;