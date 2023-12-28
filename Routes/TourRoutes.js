const express = require('express');
const app = express();
const {
  CreateNewTour,
  FindTour,
  TourFilter,
  GetSingleTour,
  checkOut,
  saveCheckout,
} = require('../controller/tourController');

app.post('/auth/v1/createTour', CreateNewTour);
app.get('/auth/v1/:from/:to', FindTour);
app.post('/auth/v1/filterPrice', TourFilter);
app.post('/auth/v1/getSingle/:id/:count', GetSingleTour);
app.post('/auth/v1/payment-checkout', checkOut);
app.get('/auth/v1/paymentGateway/:id/:para', saveCheckout);

exports.TourRoutes = app;
