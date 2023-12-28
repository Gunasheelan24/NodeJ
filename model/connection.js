const { connect } = require('mongoose');

//MongoDb Setup
exports.MongooConnect = connect(process.env.NODE_DB)
  .then(() => {
    console.log('Connected To The Database');
  })
  .catch((error) => {
    console.log(error);
  });
