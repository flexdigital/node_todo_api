// global imports
const {ObjectID} = require('mongodb');

// local imports
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// todo variables
var Tid = '595d7a81d005afd467f87da0';

if (!ObjectID.isValid(Tid)) {
    return console.log('Todo Id not valid.')
} 

// todo queries
Todo.findById(Tid).then((todo) => {
    if (!todo) {
        return console.log('Todo not found.');
    }
    console.log('Todo By Id', todo);
}).catch((e) => console.log(e));

// user variables
var Uid = '595d62b3124c3dd75f646873';

if (!ObjectID.isValid(Uid)) {
    return console.log('User Id not valid.')
}

// user queries
User.findById(Uid).then((user) => {
    if (!user) {
        return console.log('User not found.');
    }
    console.log('User By Id', user);
}).catch((e) => console.log(e));