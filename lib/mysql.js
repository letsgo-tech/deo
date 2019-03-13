const mysql = require('mysql');

let pool;

const connect = (config) => {
	const { host, port, user, password, name: database } = config;
	pool = mysql.createPool({
		host,
		port,
		user,
		password,
		database
	});
}

const query = (sql, params = [], cb) => {
	pool.getConnection((err, conn) => {
		if (err) {
      console.error(err)
			cb(err, null, null);
		} else {
			conn.query(sql, params, (qerr, vals, fields) => {
				conn.release();
				cb(qerr, vals, fields);
			})
		}
	})
};

module.exports = {
	connect,
	query
};
