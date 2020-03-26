const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require('../db/user');
 
// Route paths are prepended with /auth

router.get('/', (req, res) => {
  res.json({
    message: '🔐'
  });
});

// User can login with valid email/password
// User cannot login with blank or missing email
// User cannot login with blank or incorrect password

function validUser(user) {
  const validEmail = typeof user.email == 'string' &&
                     user.email.trim() != '';
  const validPassword = typeof user.password == 'string' &&
                        user.password.trim() != '' &&
                        user.password.trim().length >= 6;
  return validEmail && validPassword;
}

router.post('/signup', (req, res, next) => {
  if(validUser(req.body)) {
    User
      .getOneByEmail(req.body.email)
      .then(user => {
        console.log('user', user);
        // if user was not found
        if(!user) {
          // this is a unique email
          // hash password
          bcrypt.hash(req.body.password, 10)
            .then((hash) => {
              // insert user into db
              const user = {
                email: req.body.email,
                password: hash,
                created_at: new Date()
              };

              User
                .create(user)
                .then(id => {
                  // redirect
                  setUserIdCookie(req, res, id);
              res.json({
                id,
                message: '✅'
              });
                });
          });
        } else {
          // email in use
          next(new Error('Email in use'));
        }
      });
  } else {
    // send an error
    next(new Error('Invalid user'));
  }
});

function setUserIdCookie(req, res, id) {
  const isSecure = req.app.get('env') != 'development';
  res.cookie('user_id', id, {
                httpOnly: true,
                secure: isSecure,
                signed: true
              });
}

router.post('/login', (req, res, next) => {
  if(validUser(req.body)) {
    User
      .getOneByEmail(req.body.email)
      .then(user => {
        console.log('user', user);
        if(user) {
          // compare password with hashed password
          bcrypt.compare(req.body.password, user.password)
          .then((result) => {
            // if the passwords matched
            if(result) {
              // setting the 'set-cookie' header
              setUserIdCookie(req, res, user.id);
              res.json({
                id: user.id,
                message: 'Logged in! 🔓'
              })
            } else {
              next(new Error('Invalid login'));
            }
          });
        } else {
          next(new Error('Invalid login'));
        }
      });
  } else {
    next(new Error('Invalid login'));
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.json({
    message: '🔒'
  });
});

module.exports = router;