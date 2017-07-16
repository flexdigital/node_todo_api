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
const app = express();
const port = process.env.PORT;

// middleware
app.use(bodyParser.json());

// TODOS ROUTES
// ---------------------------------------------
// POST Routes
app.post('/todos', authenticate, async (req, res) => {
    const todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });
    try {
        const doc = await todo.save();
        res.send(doc);
    } catch (e) {
        res.status(400).send(e);
    }    
});

// GET Routes
app.get('/todos', authenticate, async (req, res) => {
    try {
        const todos = await Todo.find({
        _creator: req.user._id
        });
    res.send({todos});
    } catch (e) {
    res.status(400).send(e);
    }
});

app.get('/todos/:id', authenticate, async (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Todo Is is not valid');
    }
    try {
        const todo = await Todo.findOne({
            _id: id,
            _creator: req.user._id
        });
        if (!todo) {
            return res.status(404).send('Todo not found');
        }
        res.send({ todo });
    } catch (e) {
        res.status(400).send('Oops! Something went wrong');
    }    
});

// DELETE Routes
app.delete('/todos/:id', authenticate, async (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Todo Is is not valid, could not be removed');
    }
    try {
        const todo = await Todo.findOneAndRemove({
            _id: id,
            _creator: req.user._id
        });
        if (!todo) {
            return res.status(404).send('Todo not found, could not be removed');
        }
        res.send({ todo });
    } catch (e) {
        res.status(400).send('Oops! Something went wrong');
    }
});

// UPDATE Routes
app.patch('/todos/:id', authenticate, async (req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Todo Is is not valid, could not be removed');
    }
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    try {
        const todo = await Todo.findOneAndUpdate({
            _id: id,
            _creator: req.user._id
        }, { $set: body }, { new: true });
        if (!todo) {
            return res.status(404).send('Todo not found, could not be updated');
        }
        res.send({ todo });
    } catch (e) {
        res.status(400).send('Oops! Something went wrong');
    }    
});

// USERS ROUTES
// ---------------------------------------------
// POST Routes
app.post('/users', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = new User(body);
        await user.save();
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

app.post('/users/login', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send('Oops! Something went wrong');
    }
});

// GET Routes
app.get('/users/me', authenticate, (req ,res) => {
    res.send(req.user);
});

// DELETE Routes
app.delete('/users/me/token', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch (e) {
        res.status(400).send();
    }
});

// porting
app.listen(port, () => {
    console.log(`Started on Port ${port}`);
});

module.exports = {app};