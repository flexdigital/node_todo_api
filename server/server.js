// global imports
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

// local imports
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

// app
var app = express();

// middleware
app.use(bodyParser.json());

// post routes
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

// get routes
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    
    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Todo Is is not valid');
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send('Todo not found');
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send('There was an error');
    });
});

// porting
app.listen(3000, () => {
    console.log('Started on Port 3000');
});

module.exports = {app};