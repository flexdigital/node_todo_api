// requirements
require('./config/config');

// global imports
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

// local imports
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

// app
var app = express();
const port = process.env.PORT;

// middleware
app.use(bodyParser.json());

// TODOS ROUTES
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
        res.status(400).send('Oops! Something went wrong');
    });
});

// delete routes
app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Todo Is is not valid, could not be removed');
    }
    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).send('Todo not found, could not be removed');
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send('Oops! Something went wrong');
    });
});

// update routes
app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Todo Is is not valid, could not be removed');
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send('Todo not found, could not be updated');
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send('Oops! Something went wrong');
    });
});

// USERS ROUTES
// post routes
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send('Oops! Something went wrong');
    });
});

// get routes
app.get('/users/me', authenticate, (req ,res) => {
    res.send(req.user);
});

// porting
app.listen(port, () => {
    console.log(`Started on Port ${port}`);
});

module.exports = {app};