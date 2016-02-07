var express = require('express');

var app = express();

var PORT = process.env.PORT || 3000;

var todos = [{
	id: 1,
	description: 'Meet Mom for Lunch',
	completed: false
}, {
	id: 2, 
	description: 'Pick up the Dry Cleaners', 
	completed: false
}, {
	id: 3, 
	description: 'Get the groceries', 
	completed: true
}];

app.get('/', function(req, res){
	res.send('todo API root');
});

//GET /todos
app.get('/todos', function(req, res){
	res.json(todos);
});

//GET /todos/:id
app.get('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id, 10);  //always use ten here. 

	var matchedTodo;

	todos.forEach(function(todo){
		if (todoId === todo.id){
			matchedTodo = todo;
		}
	});

	if (matchedTodo){
		res.json(matchedTodo);
	}else{
		res.status(404).send();
	}

});

app.listen(PORT, function(){
	console.log('Express Listening on port ' + PORT + '!');
});

