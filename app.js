const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// To parse the incoming request bodies in a middleware before your handlers, you can use the express.json() middleware
app.use(express.json());

app.use(express.static(`${__dirname}/public`));

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
