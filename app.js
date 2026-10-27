const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
);

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

//Middleware 1
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log('Hello from the middleware 🚀', req.requestTime);
  next();
});

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app.use((req, res, next) => {
  console.log('Hello from the middleware 🚀');
  next(); // if we dont call next() the request will be stuck in this middleware
});

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// app.post('/api/v1/tours', createTour);

//patch a tour
// app.patch('/api/v1/tours/:id', updateTour);

// // delete a tour
// app.delete('/api/v1/tours/:id', deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
