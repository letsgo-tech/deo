const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { connect } = require('./lib/mysql');

const argv = process.argv
if (argv.length <= 2) {
    console.log('请指定配置文件地址');
    return;
}

const args = argv.splice(2);
let seq, config;

for (let i = 0; i < args.length; i++) {
	if (args[i] === '--config') {
		seq = i;
		break;
	}
}

if (seq < 0) {
	console.log('using default config');
	config = require('./config.default.json');
} else {
	try {
		config = require(args[seq + 1]);
	} catch (error) {
		console.log('cannot find config file, switch to default config');
		config = require('./config.default.json');
	}
}

const { server, database } = config;
connect(database);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'src')));

app.use((req, res, next) => {

	const { url } = req;
	if (url === '/') {
		res.redirect('/projects');
		return;
	}

	if (url.indexOf('/api/projects') > -1 || url.indexOf('/api/project') > -1 || url.indexOf('/api/rule') > -1) {
		const token = req.headers.authorization;
		jwt.verify(token, 'deo', (err, decode) => {
			if (err) {
				res.send({
					status: 403,
					msg: '请重新登录'
				});
			} else {
				next();
			}
		});
	} else {
		next();
	}
});

app.get('/login', (req, res) => {
	res.sendFile(__dirname + '/./src/login/index.html');
});

app.get('/signup', (req, res) => {
	res.sendFile(__dirname + '/./src/signup/index.html');
});

app.get('/projects', (req, res) => {
	res.sendFile(__dirname + '/./src/projects/index.html');
});

app.get('/project', (req, res) => {
	res.sendFile(__dirname + '/./src/project/index.html');
});


app.use('/api/login', require('./router/login.js'));
app.use('/api/signup', require('./router/signup.js'));
app.use('/api/projects', require('./router/projects.js'));
app.use('/api/project', require('./router/project.js'))
app.use('/api/rule', require('./router/rule.js'))

app.use('/render', require('./router/render.js'));

app.listen(server.port, () => console.log(`node server listening ${server.port}`));
