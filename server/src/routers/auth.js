const express = require('express')
const passport = require('../middleware/passport')
const router = express.Router()

const userController = require('../controllers/user');

const CLIENT_HOME_PAGE_URL = "http://localhost:3000";

// when login is successful, retrieve user info
router.get("/login/success", (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      cookies: req.cookies
    });
  }
});

// when login failed, send failed msg
router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
});

// When logout, redirect to client
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(CLIENT_HOME_PAGE_URL);
});



/////////////////////////////////////////////////////////////



// auth with twitter
router.get("/twitter", passport.authenticate("twitter"));

// redirect to home page after successfully login via twitter
router.get(
  "/twitter/redirect",
  passport.authenticate("twitter", {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: "/auth/login/failed"
  })
);

// auth with 42
router.get("/42", passport.authenticate("42", { session: false }));

// redirect to home page after successfully login via 42
router.get("/42/redirect",
    passport.authenticate("42", {
    //   successRedirect: CLIENT_HOME_PAGE_URL,
      failureRedirect: "/api/oauth/login/failed",
      session: false
    }), (req, res) => {
        var string = encodeURIComponent(req.user.token);
        // res.send(req.user.token)
        res.redirect('http://localhost:3000/login?oauth=' + string)
    }
  );

module.exports = router;
