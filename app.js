const express = require('express');
const app = express();
const dotenv = require('dotenv').config({ path: './config.env' });
const cors = require('cors');
const cookie = require('cookie-parser');
const port = process.env.NODE_PORT || 8080;
const { appRouter } = require('./Routes/UserRoutes');
const { TourRoutes } = require('./Routes/TourRoutes');
const { tourModel } = require('./model/tourModel');
require('./model/connection');

//Cors() MiddleWare
let corsOption = { origin: process.env.NODE_CORS, credentials: true };
app.use(cors(corsOption));
app.use(process.env.NODE_CORS, cors());
app.set('trust proxy', 1);
app.use(cookie());

//MiddleWare For Parsing The Body
app.use(express.json());

app.get('/auth/v1/getTourDetails/:tour', async (req, res) => {
  try {
    const param = req.params.tour;
    const getData = await tourModel.find();
    const getNewData = getData.filter((iterateData, Ind) => {
      if (iterateData.from.startsWith(param)) {
        return iterateData;
      }
    });
    res.status(200).json({
      status: 'Success',
      result: getNewData,
    });
  } catch (error) {
    res.status.json({
      status: 'failed',
      errorMessage: error,
    });
  }
});

//User MiddleWare
app.use('/', appRouter);

//FlightRoute MiddleWare
app.use('/', TourRoutes);

app.listen(port, (connect) => console.log('Server Running'));
