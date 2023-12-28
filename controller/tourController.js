const { tourModel } = require('../model/tourModel');
const stripe = require('stripe')(process.env.NODE_STRIPE);

exports.CreateNewTour = async (req, res) => {
  try {
    const {
      from,
      to,
      fromAirportCode,
      toAirportCode,
      ticketPrice,
      gst,
      adult,
      flightName,
      flightNumber,
      travelTime,
      startTime,
      endTime,
    } = req.body;
    await tourModel.create({
      from,
      to,
      fromAirportCode,
      toAirportCode,
      ticketPrice,
      gst,
      adult,
      startTime,
      endTime,
      flightName,
      flightNumber,
      travelTime,
    });
    res.status(200).json({
      status: 'Success',
      message: 'Tour Created',
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      errorMessage: error,
    });
  }
};

exports.FindTour = async (req, res) => {
  try {
    let { from, to } = req.params;
    const findTour = await tourModel.find({ from, to });
    if (findTour) {
      res.status(200).json({
        status: 'Success',
        message: findTour,
        length: findTour.length,
      });
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'there is no flight found',
      });
    }
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      errorMessage: error,
    });
  }
};

exports.TourFilter = async (req, res) => {
  try {
    let { journeyTime, price, from, to } = req.query;
    if (price && !journeyTime) {
      if (price == 1) {
        const newTour = await tourModel
          .find({ from, to })
          .sort({ ticketPrice: 1 });
        res.status(200).json({
          status: 'Success',
          result: newTour.length,
          message: newTour,
        });
      } else if (price == -1) {
        const newTour = await tourModel
          .find({ from, to })
          .sort({ ticketPrice: -1 });
        res.status(200).json({
          status: 'Success',
          result: newTour.length,
          message: newTour,
        });
      }
    } else if (journeyTime) {
      let greatedThen;
      let lessThen;
      if (journeyTime === 'morning') {
        greatedThen = '06:00';
        lessThen = '12:00';
      } else if (journeyTime === 'afternoon') {
        greatedThen = '12:00';
        lessThen = '17:00';
      } else if (journeyTime === 'night') {
        greatedThen = '17:00';
        lessThen = '24:00';
      }
      if (journeyTime && !price) {
        let UpdatedValue = await tourModel
          .find({
            from,
            to,
          })
          .and([
            { startTime: { $gt: greatedThen } },
            { endTime: { $lt: lessThen } },
          ]);
        res.status(200).json({
          status: 'Success',
          message: UpdatedValue,
        });
      } else {
        let UpdatedValue = await tourModel
          .find({
            from,
            to,
          })
          .and([
            { startTime: { $gt: greatedThen } },
            { endTime: { $lt: lessThen } },
          ])
          .sort({ ticketPrice: price * 1 });
        res.status(200).json({
          status: 'Success',
          message: UpdatedValue,
        });
      }
    } else if (price && journeyTime) {
      const newTour = await tourModel.find({ from, to }).and([{}, {}]);
    }
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      errorMessage: error,
    });
  }
};

exports.GetSingleTour = async (req, res) => {
  try {
    const id = req.params.id;
    const adultCount = req.params.count;
    const userId = await tourModel.findById(id);
    let final = adultCount * userId.ticketPrice;
    let gstCount = adultCount * userId.gst;
    totalPrice = final += gstCount;
    res.status(200).json({
      status: 'Success',
      message: userId,
      totalPrice: totalPrice,
    });
  } catch (error) {
    res.status(404).json({
      status: 'Success',
      message: error,
    });
  }
};

exports.checkOut = async (req, res, next) => {
  try {
    let { name, email } = req.body.data.value;
    let id = req.body.data.id;
    let tourId = await tourModel.findOne({ _id: id });
    let total = req.body.data.total;
    let domain = process.env.NODE_REACTJS;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: tourId.flightName,
            },
            unit_amount: total * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email,
      success_url: `${process.env.NODE_REACTJS}success/${id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NODE_REACTJS}success`,
    });
    res.status(200).json({
      status: 'Success',
      url: session.url,
    });
  } catch (error) {
    res.status(404).json({
      status: 'faied',
      message: error,
    });
  }
};

exports.saveCheckout = async (req, res) => {
  try {
    let finalResult = await stripe.checkout.sessions.retrieve(req.params.id);
    let findTour = await tourModel.findOne({ _id: req.params.para });
    res.status(200).json({
      status: 'Success',
      data: findTour,
      result: finalResult,
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      errorMessage: error,
    });
  }
};
