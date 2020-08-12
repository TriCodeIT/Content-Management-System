var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function (req, res, next) {
  const email = 'example@gmail.com';
  var token = jwt.sign({ email: email }, 'good');
  res.json({
    message: 'succes',
    token
  })
})

module.exports = router;
