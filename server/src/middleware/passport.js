
const User = require('../models/User')

const passport = require('passport');
const passportJwt = require("passport-jwt");
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

passport.use(new JwtStrategy({
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey   : process.env.JWT_KEY,
	passReqToCallback: true
}, async (req, jwt_payload, done) => {
	const token = req.header('Authorization').replace('Bearer ', '')
	await User.findOne({ _id: jwt_payload._id, 'tokens.token': token }).then(function(user) {
		if (user) {
			req.token = token;
			return done(null, user);
		} else {
			return done(null, false);
		}
	}).catch(err => console.error(err));
}))

module.exports = passport
