const User = require('../models/User');
const Mail = require('../models/Mails');
const Film = require('../models/Film');

const bcrypt = require('bcryptjs');
const htmlspecialchars = require('htmlspecialchars');
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
const validateLoginForgottenInput = require('../validation/loginForgotten');
const validateLoginNewPasswordInput = require('../validation/loginNewPassword');
const validateSettingsInput = require('../validation/settings');

module.exports = {

	register: (req, res) => {
		const { errors, isValid } = validateRegisterInput(req.body);
		if (!isValid) return res.status(400).json(errors);

		const username = htmlspecialchars(req.body.username);
		const email = htmlspecialchars(req.body.email);
		const firstName = htmlspecialchars(req.body.firstName);
		const lastName = htmlspecialchars(req.body.lastName);
		const password = htmlspecialchars(req.body.password);

		User.find({ $or: [{ username: username }, { email: email }] }).then(async user => {
			if (user == '') {
				const mail_token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
				const newUser = new User({
					username: username,
					email: email,
					firstName: firstName,
					lastName: lastName,
					password: password,
					register_token: mail_token
				});
				newUser.password = bcrypt.hashSync(password, 10);
				const token = await newUser.generateAuthToken()
				newUser.save().then(user => {
					res.status(201).json({ user, token })
				});
				Mail.mailSignup(email, username, mail_token, res);
			}
			else if (user[0].email == email) {
				return res.status(400).json({
					email: 'Email already exists'
				});
			} else if (user[0].username == username) {
				return res.status(400).json({
					username: 'Username already exists'
				});
			}
		}).catch(err => console.error(err));
	},

	registerValidation: (req, res) => {
		const username = htmlspecialchars(req.body.username);
		const token = htmlspecialchars(req.body.token);

		User.findOne({ username: username }).then(async user => {

			if (user && user.register_token === token && user.confirmed === false) {
				user.confirmed = true;
				user.register_token = null;
				user.save().then(user => {
					res.status(201).json({ user, token, message: 'Confirmed' });
				})
			} else if (user && user.confirmed === true) {
				res.status(201).json({ user, token, message: 'Already activated' });
			} else {
				return res.status(400).end();
			}
		});

	},

	login: (req, res) => {
		const { errors, isValid } = validateLoginInput(req.body);
		if (!isValid) return res.status(400).json(errors);

		const email = htmlspecialchars(req.body.email);
		const password = htmlspecialchars(req.body.password);

		User.findOne({ $or: [{ username: email }, { email: email }] }).then(user => {
			if (!user) {
				errors.email = 'User not found'
				return res.status(404).json(errors);
			}
			if (user.confirmed === true) {
				bcrypt.compare(password, user.password)
					.then(async isMatch => {
						if (isMatch) {
							await user.generateAuthToken().then((token) => {
								res.json({
									user: user,
									success: true,
									token: `Bearer ${token}`
								});
							}).catch(err => console.error('There was some error with the token', err));
						}
						else {
							errors.password = 'Incorrect Password';
							return res.status(400).json(errors);
						}
					});
			} else {
				errors.confirmed = 'Account not confirmed';
				Mail.mailSignup(user.email, user.username, user.register_token, res);
				return res.status(400).json(errors);
			}
		});
	},

	loginForgotten: (req, res) => {
		const { errors, isValid } = validateLoginForgottenInput(req.body);
		if (!isValid) return res.status(400).json(errors);

		const email = htmlspecialchars(req.body.email);

		User.findOne({ email }).then(user => {
			if (!user) {
				errors.email = 'User not found';
				return res.status(404).json(errors);
			}
			const mail_token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
			user.fpwd_token = mail_token;
			user.save().then(user => {
				res.status(201).json({ user });
			})
			Mail.mailLoginForgotten(email, user.username, mail_token, res);
		});
	},

	loginCheckNewPassword: (req, res) => {
		const username = htmlspecialchars(req.body.username);
		const token = htmlspecialchars(req.body.token);

		User.findOne({ username }).then(user => {
			if (!user) {
				errors.email = 'User not found';
				return res.status(404).json(errors);
			}
			if (user && token === user.fpwd_token)
				return res.status(201).end();
			else
				return res.status(400).end();
		});
	},

	loginNewPassword: (req, res) => {
		const { errors, isValid } = validateLoginNewPasswordInput(req.body);
		if (!isValid) return res.status(400).json(errors);

		const username = htmlspecialchars(req.body.username);
		const password = htmlspecialchars(req.body.password);
		const newPassword = bcrypt.hashSync(password, 10);

		User.findOne({ username }).then(user => {
			if (!user) {
				errors.email = 'User not found';
				return res.status(404).json(errors);
			}
			user.password = newPassword;
			user.fpwd_token = null;
			user.save().then(user => {
				res.status(201).json({ user });
			});
		});
	},

	logout: async (req, res) => {
		try {
			req.user.tokens = req.user.tokens.filter((token) => {
				return token.token != req.token
			})
			await req.user.save()
			res.send()
		} catch (error) {
			res.status(500).send(error)
		}
	},

	logoutall: async (req, res) => {
		try {
			req.user.tokens.splice(0, req.user.tokens.length)
			await req.user.save()
			res.send()
		} catch (error) {
			res.status(500).send(error)
		}
	},

	modifySettings: (req, res) => {
		const { errors, isValid } = validateSettingsInput(req.body);
		if (!isValid) return res.status(400).json(errors);

		let update = {};
		const userId = htmlspecialchars(req.body.userId);
		const filter = { _id: userId };
		const settings = req.body.settings;
		const oAuth = settings.oAuth;
		const avatar = htmlspecialchars(settings.avatar);
		const lang = htmlspecialchars(settings.lang);

		if (!oAuth) {
			const email = htmlspecialchars(settings.email);
			const firstName = htmlspecialchars(settings.firstName);
			const lastName = htmlspecialchars(settings.lastName);
			const password = htmlspecialchars(settings.password);

			update = { avatar, lang, email, firstName, lastName };
			if (password != '')
				update.password = bcrypt.hashSync(password, 10);
		} else
			update = { avatar, lang };

		User.findOneAndUpdate(filter, update, { new: true }, (err, data) => {
			if (err) {
				return res.status(400).json(errors);
			} else {
				const convertData = data.toObject();
				let postData = {};
				if (!oAuth)
					postData = {
						oAuth: oAuth,
						avatar: convertData.avatar,
						lang: convertData.lang,
						email: convertData.email,
						firstName: convertData.firstName,
						lastName: convertData.lastName
					};
				else
					postData = {
						oAuth: oAuth,
						avatar: convertData.avatar,
						lang: convertData.lang
					}
				res.status(201).json(postData);
			}
		});
	},

	getSettings: (req, res) => {
		const userId = htmlspecialchars(req.body.userId);

		User.findOne({ _id: userId }, ['email', 'firstName', 'lastName', 'lang', 'avatar', 'oAuth'], (err, data) => {
			if (err)
				res.status(500).send(err);
			else
				res.status(200).json(data);
		})
	},

	getUserInfo: (req, res) => {
		const username = htmlspecialchars(req.body.username);

		User.findOne({ username: username }, ['avatar', 'username', 'firstName', 'lastName'], (err, data) => {
			if (err)
				return res.status(500).send(err);

			Film.find({ "is_seen.userId": data._id }, null, { limit: 10 }, (err, films) => {
				if (err)
					return res.status(500).send(err);
				else {
					newData = data.toObject();
					newData.films_seen = films;
					res.status(200).json(newData);
				}
			});
		});
	}
}
