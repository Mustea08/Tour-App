const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// 1) MIDDLEWARES
app.use(morgan('dev'));

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
);

// 2) ROUTES HANDLERS
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      //handel the error
      if (err) {
        res.status(500).json({
          status: 'error',
          message: 'Something went wrong',
        });
      }
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    },
  );
};

const getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'No tour found with that ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const updateTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'No tour found with that ID',
    });
  }
  tour.duration = req.body.duration;
  console.log('tour ====', tour);

  res.status(200).json({
    status: 'success',
    data: {
      tour: 'updated tour',
    },
  });
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'No tour found with that ID',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// Middleware 2
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not implemented yet!',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not implemented yet!',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not implemented yet!',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not implemented yet!',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not implemented yet!',
  });
};

//Middleware 1
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log('Hello from the middleware 🚀', req.requestTime);
  next();
});

// Tour Routes & User Routes

const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route('/').get(getAllTours).post(createTour);

tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

// app
//   .route('/api/v1/tours/:id')
//   .get(getTour)
//   .patch(updateTour)
//   .delete(deleteTour);

// app.post('/api/v1/tours', createTour);

//patch a tour
// app.patch('/api/v1/tours/:id', updateTour);

// // delete a tour
// app.delete('/api/v1/tours/:id', deleteTour);

// User Routes

userRouter.route('/').get(getAllUsers).post(createUser);

userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
