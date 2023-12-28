const { Schema, model } = require('mongoose');
const validate = require('validator');
const bCrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const schemaObject = new Schema({
  username: {
    type: String,
    required: [true, 'Enter Your Username'],
  },
  email: {
    type: String,
    required: [true, 'Enter Your Email Address'],
    unique: [true, 'Email Already Exist'],
    validate: {
      validator: validate.isEmail,
      message: 'Enter Valid Email Address',
    },
  },
  password: {
    type: String,
    required: [true, 'Enter Your Password'],
  },
  confirmpassword: {
    type: String,
    required: [true, 'Enter Your ConfirmPassword'],
    select: false,
  },
  profilePicture: {
    type: String,
    default: 'Default.avif',
  },
  isToken: {
    type: String,
  },
  tokenAge: {
    type: Date,
  },
  travellerDetails: {
    type: Array,
  },
});

exports.hashedMethod = async function (password) {
  try {
    let Newpassword = await bCrypt.hash(password, 12);
    return Newpassword;
  } catch (error) {
    console.log(error);
  }
};

schemaObject.methods.verfyPasswordAuth = async (
  plainPassword,
  hashedPassword
) => {
  try {
    let verfyPassword = await bCrypt.compare(plainPassword, hashedPassword);
    return verfyPassword;
  } catch (error) {
    console.log(error);
  }
};

schemaObject.methods.generateJsonWebToken = async (userId) => {
  try {
    const token = await jwt.sign({ userId }, process.env.NODE_JWT, {
      expiresIn: '3h',
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};

exports.userModel = model('userData', schemaObject);
