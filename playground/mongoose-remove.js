// global imports
const {ObjectID} = require('mongodb');

// local imports
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// Todo.findOneAndRemove
// Todo.findByIdAndRemove

Todo.findByIdAndRemove('595d96125533869dc90909df').then((todo) => {
    console.log(todo);
});