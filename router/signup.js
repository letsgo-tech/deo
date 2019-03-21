const express = require('express');
const router = express.Router();

const sha256 = require('js-sha256').sha256;
const { query } = require('../lib/mysql.js');

const moment = require('moment');

router.post('/', (req, res) => {

	const { username, password } = req.body;
	if (!/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{6,20})/.test(password)) {
		res.send({
			status: 404,
			msg: 'It is recommended to use a combination of two or more letters and numbers, 6-20 characters.',
		})
	}

	query('SELECT * FROM user_info WHERE username = ?', [username], (err, vals, fileds) => {
		if (err) {
			res.send({
				status: 500,
				msg: 'connect db failed',
			});
		} else if (vals.length > 0){
			res.send({
				status: 404,
				msg: 'User name already exists',
			})
		} else {
			const created = moment().format("YYYY-MM-DD h:mm:ss");

			const userInfo = {
				username,
				password: sha256(password),
				created
			}
			query('INSERT INTO user_info SET ?', userInfo, (err, rules, fileds) => {
				if (err) {
					res.json({
						status: 500,
						msg: 'add user failed',
					});
				} else {
					res.json({
						status: 200,
						data: {},
						msg: 'ok'
					})
				}
			});
		}
	});
});

module.exports = router;