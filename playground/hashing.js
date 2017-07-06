const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     });
// });

var hashedPassword = '$2a$10$f3uBg6KrSMLfUAM7Jh3LuOYEt2UdmMYThO3Bb5hiu/y/kpVn772Z.';

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
});