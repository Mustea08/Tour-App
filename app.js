const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
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

//Global Error Handling Middleware
app.all('*', (req, res, next) => {
  const err = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404,
  );
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
