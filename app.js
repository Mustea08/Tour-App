const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
app.use(morgan('dev'));

app.use(express.json());

//Middleware 1
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log('Hello from the middleware 🚀', req.requestTime);
  next();
});

// Tour Routes & User Routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
