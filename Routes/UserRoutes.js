const express = require('express');
const app = express();
const {
  CreateAccount,
  sentEmail,
  changePassword,
  login,
} = require('../controller/userController');

app.post('/auth/v1/Signup', CreateAccount);
app.get('/auth/v1/resetToken/:id', sentEmail);
app.patch('/auth/v1/changePassword/:email/:token', changePassword);
app.post('/auth/v1/signin', login);

exports.appRouter = app;
