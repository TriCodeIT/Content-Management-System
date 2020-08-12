var express = require('express');
var router = express.Router();

const user = require('../models/user')

var jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const secret = 'This is a secrett';

/* GET Users listing. */
router.get('/list', function (req, res) {
  let response = [];
  user.find({})
    .then(result => {
      response = result.map(item => {
        return {
          _id: item._id,
          email: item.email,
          password: item.password,
          token: item.token
        }
      })
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json({
        response
      });
    })
})

//==================== POST REGISTER (METHOD:POST) ==============================
router.post('/register', function (req, res, next) {
  let { email,
    password,
    retypepassword } = req.body;

  let response = {
    message: "",
    data: {},
    token: ""
  }

  if (password != retypepassword) return res.status(500).json({
    error: true,
    message: "password doesn't match"
  })
  user.findOne({ email })
    .then(result => {
      if (result) {
        response.message = 'Email already exist';
        return res.status(200).json(response)

      } else {

        var token = jwt.sign({ email: email }, secret);
        let User = new user({
          email: email,
          password: password,
          token: token
        })
        User.save()
          .then(data => {
            response.message = "register success"
            response.data.email = email
            response.token = token
            res.status(201).json(response)
          })
          .catch(err => {
            res.status(500).json({
              error: err
            })
          })

      }
    }).catch(err => {
      res.status(500).json({
        error: true,
        message: 'error Users findOne'
      })
    })
});


// ======================= POST LOGIN (METHOD POST) =============================
router.post('/login', function (req, res, next) {
  let { email,
    password } = req.body;

  let response = {
    message: "",
    data: {},
    token: ""
  }
  user.findOne({ email })
    .then(data => {
      // console.log('alurdata1',data);
      // console.log(password, data.password);

      bcrypt.compare(password, data.password)
        .then(isPasswordTrue => {
          // console.log('password', isPasswordTrue);
          if (isPasswordTrue) {
            if (data.token) {
              response.token = data.token;
              response.data.email = email;
              response.message = "Login success!"
              res.status(201).json(response)
            } else {
              // console.log('masuk sini ya');
              const newToken = jwt.sign({ email: data.email }, secret)

              user.updateOne({ email: data.email }, { token: newToken })
                .then(() => {
                  response.token = newToken;
                  response.data.email = data.email;
                  response.message = "Login success!";
                  res.status(201).json(response);
                })
                .catch(err => {
                  response.message = "Update token failed"
                  res.status(200).json(response);
                })
            }
          } else {
            // console.log('masuk sini ke2');
            response.message = "Authentication failed";
            res.status(200).json(response);
          }
        })
        .catch(err => {
          response.message = "Authentication failed";
          res.status(500).json(response);
        })
    })
    .catch(err => {
      response.message = "Email doesn't exist"
      res.status(200).json(response);
    })
})

// ======================= POST CHECK TOKEN (METHOD POST) =============================
router.post('/check', function (req, res, next) {
  let token = req.header('token')
  let response = {
    valid: false
  }
  // console.log(token)

  if (!token) {
    res.status(500).json(response)
  } else {
    const decode = jwt.verify(token, secret);
    // console.log(decode)
    user.find({ email: decode.email })
      .then(result => {
        response.valid = true
        res.status(200).json(response)
      })
      .catch(err => {
        res.status(500).json({ response })
      })
  }
});

// ============================== DESTROY TOKEN (METHOD GET) ====================================
router.get('/logout', function (req, res, next) {
  let token = req.header('token')
  let response = {
    logout: false
  }

  if (!token) {
    res.status(500).json(response);
  } else {
    const decode = jwt.verify(token, secret)
    user.findOneAndUpdate({ email: decode.email }, { token: "" }, { new: true })
      .then(result => {
        // console.log(result)
        response.logout = true
        res.status(200).json(response)
      })
      .catch(err => {
        res.status(500).json(response)
      })
  }
});


module.exports = router;
