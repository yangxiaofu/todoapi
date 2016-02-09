var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');


var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;


app.get('/', function(req, res){
	res.send('todo API root');
});

app.use(bodyParser.json());

//GET /todos
app.get('/todos', function(req, res){
	res.json(todos);
});


//GET /todos/:id
app.get('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id, 10);  //always use ten here. 

	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (matchedTodo){
		res.json(matchedTodo);
	}else{
		res.status(404).send();
	}
});



//POST request /todos
app.post('/todos', function(req, res){
	var body = req.body;

	if (!_.isBoolean(body.completed) || (!_.isString(body.description)) || (body.description.trim()).length === 0) {
		return res.status(400).send();
	}

	// add id field
	body.id = todoNextId++;

	//push body into array
	todos.push(body);

	res.json(body);
});

// DELETE / todos/:id
app.delete('/todos/:id', function(req, res){
	
	var todoId = parseInt(req.params.id, 10);

	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (!matchedTodo) {
		res.status(404).json({"error": todoId});
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}

});



app.listen(PORT, function(){
	console.log('Express Listening on port ' + PORT + '!');
});

