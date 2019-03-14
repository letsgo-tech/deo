const express = require('express');
const router = express.Router();

const sha256 = require('js-sha256').sha256;
const { query } = require('../lib/mysql.js');
const jwt = require('jsonwebtoken');

router.post('/', (req, res) => {

	const { username, password } = req.body;

	query('SELECT * FROM user_info WHERE username = ?', [username], (err, vals, fileds) => {
		if (err) {
			res.send({
				status: 500,
				msg: 'internal error',
			});
		} else if (vals.length < 1){
			res.send({
				status: 404,
				msg: 'no such user',
			})
		} else {
			if (vals[0].password === sha256(password)) {
				const content = {
					id: vals[0].id,
					username: vals[0].username
				};

				const cert = 'deo';

				const token = jwt.sign(content, cert);
				res.send({
					status: 200,
					token
				})
			} else {
				res.send({
					status: 401,
					msg: 'wrong password'
				})
			}
		}
	});
});

module.exports = router;