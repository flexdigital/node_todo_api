// library imports
var express = require('express');
var bodyParser = require('body-parser');

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

// porting
app.listen(3000, () => {
    console.log('Started on Port 3000');
});