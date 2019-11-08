const User = require('../models/User');
const Mail = require('../models/Mails');

const bcrypt = require('bcryptjs');
const passport = require('passport');
const passportJwt = require("passport-jwt");
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const FortyTwoStrategy = require('passport-42').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_KEY,
    passReqToCallback: true
}, async (req, jwt_payload, done) => {
    const token = req.header('Authorization').replace('Bearer ', '')
    await User.findOne({
        _id: jwt_payload._id,
        'tokens.token': token
    }).then(function(user) {
        if (user) {
            req.token = token;
            return done(null, user);
        } else {
            return done(null, false);
        }
    }).catch(err => env == 'dev' ? console.log(err) : {});
}))

passport.use(new FortyTwoStrategy({
        clientID: '915bcdfa1ddb27ed58cf0d2119fbf917319a5f5c81239d5c7874e69dacba47ce',
        clientSecret: 'bb0aff5c3e1a2e7f9bbdfded8d21958cf8798396dd7ff2fde9a5b7ae9c2de608',
        callbackURL: 'http://localhost:5000/api/oauth/42/redirect'
    },
    async (accessToken, refreshToken, profile, done) => {
        const currentUser = await User.findOne({
            fortyTwoId: profile._json.id
        });
        if (!currentUser) {
            const clear_password = Math.random().toString(36).substring(2, 15),
                username = profile._json.login + String(profile._json.id).substr(1, 3)
            const newUser = await new User({
                username: username,
                email: profile._json.email.replace('@', '+42@'),
                firstName: profile._json.first_name,
                lastName: profile._json.last_name,
                password: bcrypt.hashSync(clear_password, 10),
                fortyTwoId: profile._json.id,
                oAuth: true,
                confirmed: true
            })
            Mail.mailOAuth(profile._json.email, newUser.email, clear_password, username, '42');
            await newUser.generateAuthToken().then((token) => {
                return done(null, {
                    newUser,
                    success: true,
                    token: `Bearer ${token}`
                })
            })
        } else {
            await currentUser.generateAuthToken().then((token) => {
                return done(null, {
                    currentUser,
                    success: true,
                    token: `Bearer ${token}`
                })
            })
        }
    }
));

passport.use(new GitHubStrategy({
        clientID: 'a99fbfdca16dae0b69ff',
        clientSecret: '827aed7d85ccfc5963a3749821ad33261381e276',
        callbackURL: "http://localhost:5000/api/oauth/github/redirect",
        scope: 'user:email'
    },
    async (accessToken, refreshToken, profile, done) => {
        const currentUser = await User.findOne({
            githubId: profile._json.id
        });
        if (!currentUser) {
            const clear_password = Math.random().toString(36).substring(2, 15),
                username = profile._json.login + String(profile._json.id).substr(1, 3)
            const newUser = await new User({
                username: username,
                email: profile.emails[0].value.replace('@', '+git@'),
                firstName: profile._json.name,
                lastName: profile._json.name,
                password: bcrypt.hashSync(clear_password, 10),
                githubId: profile._json.id,
                oAuth: true,
                confirmed: true
            })
            Mail.mailOAuth(profile.emails[0].value, newUser.email, clear_password, username, 'GitHub');
            await newUser.generateAuthToken().then((token) => {
                return done(null, {
                    newUser,
                    success: true,
                    token: `Bearer ${token}`
                })
            })
        } else {
            await currentUser.generateAuthToken().then((token) => {
                return done(null, {
                    currentUser,
                    success: true,
                    token: `Bearer ${token}`
                })
            })
        }
    }
));

passport.use(new GoogleStrategy({
        clientID: '477375834167-2movcjr1ih3sf8sclgu0hkiacljdbruu.apps.googleusercontent.com',
        clientSecret: 'TtkE2UXETza6cmuXCn5ZdUSR',
        callbackURL: "http://localhost:5000/api/oauth/google/redirect",
        scope: ['email', 'profile']
    },
    async (accessToken, refreshToken, profile, done) => {
        const currentUser = await User.findOne({
            googleId: profile._json.sub
        });
        if (!currentUser) {
            const clear_password = Math.random().toString(36).substring(2, 15),
                username = profile._json.name.split(' ')[0] + profile._json.sub.substr(1, 5)
            const newUser = await new User({
                username: username,
                email: profile._json.email.replace('@', '+goog@'),
                firstName: profile._json.given_name,
                lastName: profile._json.family_name,
                password: bcrypt.hashSync(clear_password, 10),
                googleId: profile._json.sub,
                oAuth: true,
                confirmed: true
            })
            Mail.mailOAuth(profile._json.email, newUser.email, clear_password, username, 'Google');
            await newUser.generateAuthToken().then((token) => {
                return done(null, {
                    newUser,
                    success: true,
                    token: `Bearer ${token}`
                })
            })
        } else {
            await currentUser.generateAuthToken().then((token) => {
                return done(null, {
                    currentUser,
                    success: true,
                    token: `Bearer ${token}`
                })
            })
        }
    }
));

module.exports = passport