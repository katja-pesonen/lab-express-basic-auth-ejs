// routes/auth.routes.js
const { Router } = require('express');
const router = new Router();

const bcryptjs = require('bcryptjs');
const saltRounds = 10; 
 
const User = require('../models/User.model');
const { default: mongoose } = require('mongoose');


/* GET signup page */
router.get("/signup", (req, res, next) => {
    res.render("auth/signup.ejs");
  });
 

// POST route ==> to process form data
router.post('/signup', (req, res, next) => {
    // console.log("The form data: ", req.body);
   
    const { username, email, password } = req.body;

      // make sure users fill all mandatory fields:
  if (!username || !email || !password) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
    return;
  }
   
    bcryptjs
      .genSalt(saltRounds)
      .then(salt => bcryptjs.hash(password, salt))
      .then(hashedPassword => {
        return User.create({
          // username: username
          username,
          email,
          // passwordHash => this is the key from the User model
          //     ^
          //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
          passwordHash: hashedPassword
        });
      })
      .then (userFromDB => {
        console.log('Newly created user is: ', userFromDB);
        res.redirect('/userProfile') 
    })
      .catch( (error) => {
          if (error instanceof mongoose.Error.ValidationError) {
              res.status(500).render('auth/signup', { errorMessage: error.message })
          } else {
        next(error)
          }
      })
  });

// for user profile page: 
  router.get('/userProfile', (req, res) => {
      res.render('users/user-profile')
    });

 
module.exports = router;
