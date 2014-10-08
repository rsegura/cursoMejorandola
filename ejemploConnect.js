

/*
*
*primer Middelware
*/
function logger(req, res, next){
	console.log("blablalba %s %s", req.method, req.url);
	next();
}
function hello(req, res, next){
	console.log("blablalba %s %s", req.method, req.url);
	//res.setHeader('Content-Type', 'text/plain');
	res.end('Hello World #backendpro');
	next();
}


function restrict(req, res, next){
	var authorization = req.headers.authorization;
	if(!authorization){
		return next(new Error('Unauthorized'));
	}
	var parts = authorization.split(' ');
	var scheme = parts[0];
	var auth = new Buffer(parts[1], 'base64').toString().split(':');
	var user = auth[0];
	var pass = auth[1];
	
	authWithDB(user, pass, function (err){
		if(err){
			return next(err);
		}
		next();
	});
}
function admin(req, res, next){
	switch (req.url){
		case '/':
			res.end('try /users');
			break;
		case '/users':
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(['freddy', 'cvander', 'leonidas', 'camilo']));
			break;
	}
}

function authWithDB(user, pass, cb){
	if(pass !== 'backendpro'){
		return cb('Credenciales incorrectas');
	}
	cb();

}


function errorHandler(){
	var env = process.end.NODE_ENV || 'development';
	return function(err, req, res, next){
		res.statusCode = 500;
		switch(env){
		case 'development':
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(err));
			break;
		default:
			res.end('Server error');
		}
	}
}
var connect = require('connect');
var app = connect();

app
	.use(logger)
	.use('/admin', restrict)
	.use('/admin', admin)
	.use(errorHandler)
	.listen(3000);