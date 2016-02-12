var Sequelize = require('sequelize');

// for either heroku or local machine
var env = process.env.NODE_ENV || 'development';

var sequelize;

if (env === 'production') {
	//for heroku
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres'
	});

} else {
	//for local hosts
	sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/data/dev-todo-api.sqlite'
});
}




var db = {};
db.todo = sequelize.import(__dirname + '/models/todos.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;