"use strict";

var user = require('./models/user');

user.create({ name: 'admin',    password: 'test', role: 'admin' }, console.log);
user.create({ name: 'user',     password: 'test', role: 'user'  }, console.log);
user.create({ name: 'readonly', password: 'test', role: 'guest' }, console.log);
