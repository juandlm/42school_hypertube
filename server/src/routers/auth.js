const express = require('express')
const passport = require('../middleware/passport')
const router = express.Router()

router.get("/42", passport.authenticate("42", {
    session: false
}));
router.get("/42/redirect", (req, res, next) => {
    passport.authenticate("42", {
        session: false
    }, (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('http://localhost:3000/login');
        }
        var buffer = new Buffer.from(user.token).toString('base64')
        var string = encodeURIComponent(buffer)
        return res.redirect('http://localhost:3000/login?oauth=' + string)
    })(req, res)
});

router.get("/github", passport.authenticate("github", {
    session: false
}));
router.get("/github/redirect", (req, res, next) => {
    passport.authenticate("github", {
        session: false
    }, (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('http://localhost:3000/login');
        }
        var buffer = new Buffer.from(user.token).toString('base64')
        var string = encodeURIComponent(buffer)
        return res.redirect('http://localhost:3000/login?oauth=' + string)
    })(req, res)
});

router.get("/google", passport.authenticate("google", {
    session: false
}));
router.get("/google/redirect", (req, res, next) => {
    passport.authenticate("google", {
        session: false
    }, (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('http://localhost:3000/login');
        }
        var buffer = new Buffer.from(user.token).toString('base64')
        var string = encodeURIComponent(buffer)
        return res.redirect('http://localhost:3000/login?oauth=' + string)
    })(req, res)
});

// router.get("/facebook", passport.authenticate("facebook", { session: false }));
// router.get("/facebook/redirect", (req, res, next) => {
//   passport.authenticate("facebook", { session: false }, (err, user) => {
//       if (err) { return next(err); }
//       if (!user) { return res.redirect('http://localhost:3000/login'); }
//       var buffer = new Buffer.from(user.token).toString('base64')
//       var string = encodeURIComponent(buffer)
//       return res.redirect('http://localhost:3000/login?oauth=' + string)
//     })(req, res)
// });

module.exports = router;