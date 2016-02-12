var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;


app.get('/', function(req, res) {
	res.send('todo API root');
});

app.use(bodyParser.json());

//GET /todos
app.get('/todos', function(req, res) {
	var queryParams = req.query;
	var filteredTodos = todos;

	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {

		filteredTodos = _.where(filteredTodos, {
			completed: true
		});

	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {

		filteredTodos = _.where(filteredTodos, {
			completed: false
		});

	} else {
		res.send('It goes into an error');
	}

	"Go to work on Saturday".indexOf('work');

	res.json(filteredTodos);
});


//GET /todos/:id
app.get('/todos/:id', function(req, res) {

	var todoId = parseInt(req.params.id, 10); //always use ten here. 

	db.todo.findById(todoId).then(function(todo) {
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send()
		}
	}, function(e) {
		res.status(500).send();
	});

});


//POST request /todos?completed=true
app.post('/todos', function(req, res) {

	var body = req.body;

	db.todo.create(body).then(function(todo) {
		res.json(todo.toJSON());
	}, function(e) {
		res.status(400).json(e);
	});

});


// DELETE / todos/:id
app.delete('/todos/:id', function(req, res) {

	var todoId = parseInt(req.params.id, 10);

	var matchedTodo = _.findWhere(todos, {
		id: todoId
	});

	if (!matchedTodo) {
		res.status(404).json({
			"error": todoId
		});
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}

});

// PUT / todos/:id
app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	});



	var body = _.pick(req.body, 'description', 'completed');


	var validAttributes = {

	};


	if (!matchedTodo) {

		return res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {

		validAttributes.completed = body.completed;

	} else if (body.hasOwnProperty('completed')) {

		return res.status(400).send();

	} else {
		//Never provided the attribute, no problem here. 

	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {

		validAttributes.description = body.description

	} else if (body.hasOwnProperty('description')) {

		return res.status(400).send();

	}

	// HERE

	_.extend(matchedTodo, validAttributes);

	res.json(matchedTodo);

});


db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Express Listening on port ' + PORT + '!');
	});
});