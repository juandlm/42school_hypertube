
const User = require('../models/User')

const bcrypt = require('bcryptjs');
const passport = require('passport');
const passportJwt = require("passport-jwt");
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
const FortyTwoStrategy = require('passport-42').Strategy;

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

//   passport.use(
// 	new TwitterStrategy(
// 	  {
// 		consumerKey: keys.TWITTER_CONSUMER_KEY,
// 		consumerSecret: keys.TWITTER_CONSUMER_SECRET,
// 		callbackURL: "/auth/twitter/redirect"
// 	  },
// 	  async (token, tokenSecret, profile, done) => {
// 		// find current user in UserModel
// 		const currentUser = await User.findOne({
// 		  twitterId: profile._json.id_str
// 		});
// 		// create new user if the database doesn't have this user
// 		if (!currentUser) {
// 		  const newUser = await new User({
// 			name: profile._json.name,
// 			screenName: profile._json.screen_name,
// 			twitterId: profile._json.id_str,
// 			profileImageUrl: profile._json.profile_image_url
// 		  }).save();
// 		  if (newUser) {
// 			done(null, newUser);
// 		  }
// 		}
// 		done(null, currentUser);
// 	  }
// 	)
//   );
  
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
	  const clear_password = Math.random().toString(36).substring(2, 15)
	  const newUser = await new User({
		username: profile._json.login,
		email: profile._json.email,
		firstName: profile._json.first_name,
		lastName: profile._json.last_name,
		password: bcrypt.hashSync(clear_password, 10),
		fortyTwoId: profile._json.id,
		oAuth: true,
		confirmed: true
	  })
		await newUser.generateAuthToken()
		newUser.save().then(user => {
			return done(null, user)
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
