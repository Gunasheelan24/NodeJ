const { userModel, hashedMethod } = require('../model/userModel');
const crypto = require('crypto');
const sendGrid = require('@sendgrid/mail');
sendGrid.setApiKey(process.env.NODE_EMAIL);

exports.CreateAccount = async (req, res) => {
  try {
    const { username, email, password, confirmpassword } = req.body.value;
    let newPassword = await hashedMethod(password);
    await userModel.create({
      username,
      email,
      password: newPassword,
      confirmpassword: newPassword,
    });
    res.status(201).json({
      status: 'sucess',
      Message: 'User Created SuccessFull',
    });
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      errorMessage: error,
    });
  }
};

exports.sentEmail = async (req, res) => {
  try {
    const userEmail = await userModel.findOne({ email: req.params.id });
    if (userEmail) {
      let hash = crypto.createHash('sha512').digest('hex').toString();
      userEmail.isToken = hash;
      userEmail.tokenAge = Date.now() + 3600000;
      await userEmail.save();
      let message = {
        from: 'gunasheelan1624@gmail.com',
        to: userEmail.email,
        subject: 'Requested To Reset Password',
        html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AIRWAYS</title>
  </head>
  <body>
    <h1 class="text-center" style="text-align: center">Password Reset</h1>
    <p style="text-align: center; color: black; font-size: larger">
      if you've lost your password or wish to reset it, use the link below to
      get started
    </p>
    <div style="text-align: center">
      <a href="http://localhost:5173/changePassword/${hash}/${userEmail.email}">
        <button
          type="submit"
          style="
            background-color: rgb(131, 87, 173);
            padding: 10px;
            color: rgb(0, 0, 0);
            border: 0;
            border-radius: 5px;
            font-size: large;
          "
        >
          Reset Your Password
        </button>
      </a>
    </div>
  </body>
</html>
`,
      };
      sendGrid
        .send(message)
        .then(() => console.log('Success'))
        .catch((err) => console.log(err));
      res.status(200).json({
        status: 'Success',
        message: 'Email Sended',
        data: userEmail.email,
      });
    } else {
      res.status(404).json({
        status: 'failed',
        errorMessage: '😥 Oops! No User Found',
      });
    }
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      errorMessage: error,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    let tokenVerfy = req.params.token;
    let email = req.params.email;
    let { password } = req.body;
    let userVerfy = await userModel.findOne({ email: tokenVerfy });
    let checkPassword = await userVerfy.verfyPasswordAuth(
      password,
      userVerfy.password
    );
    if (checkPassword === true) {
      res.status(404).json({
        status: 'Failed',
        errorMessage: 'New Password And Old Password Are Same!!',
      });
    } else {
      if (email === userVerfy.isToken) {
        let newPassword = await hashedMethod(req.body.password);
        userVerfy.password = newPassword;
        userVerfy.confirmpassword = newPassword;
        userVerfy.isToken = undefined;
        userVerfy.tokenAge = undefined;
        await userVerfy.save({ validateBeforeSave: false });
        res.status(200).json({
          status: 'Success',
          message: 'Password Changed Success',
        });
      } else {
        res.status(404).json({
          status: 'failed',
          message: 'Session Expired',
        });
      }
    }
  } catch (error) {
    res.status(404).json({
      status: 'Failed',
      errorMessage: error,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body.data;
    let userVerify = await userModel.findOne({ email });
    if (userVerify) {
      const userPassoword = await userVerify.verfyPasswordAuth(
        password,
        userVerify.password
      );
      if (userPassoword === true) {
        let token = await userVerify.generateJsonWebToken(userVerify._id);
        res.cookie('jwt', token);
        res.status(200).json({
          status: 'Success',
          jwt: token,
          userId: userVerify._id,
        });
      } else {
        res.status(404).json({
          status: 'failed',
          errorMessage: 'Please Enter Correct Password',
        });
      }
    } else {
      res.status(404).json({
        status: 'failed',
        errorMessage: 'Check Your Email Address',
      });
    }
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      errorMessage: error,
    });
  }
};
