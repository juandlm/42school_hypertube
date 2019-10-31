const User = require('../models/User');
const Mail = require('../models/Mails');

const bcrypt = require('bcryptjs');
const htmlspecialchars = require('htmlspecialchars');
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
const validateLoginForgottenInput = require('../validation/loginForgotten');
const validateLoginNewPasswordInput = require('../validation/loginNewPassword');
const validateSettingsInput = require('../validation/settings');

module.exports = {

	register: (req, res) => {

		console.log(req.body)
		const { errors, isValid } = validateRegisterInput(req.body);
		if (!isValid) return res.status(400).json(errors);

		const username = htmlspecialchars(req.body.username);
		const email = htmlspecialchars(req.body.email);
		const firstName = htmlspecialchars(req.body.firstName);
		const lastName = htmlspecialchars(req.body.lastName);
		const password = htmlspecialchars(req.body.password);

		User.find({$or: [{ username: username }, { email: email }]}).then(async user => {
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

			if (user && user.register_token === token) {
				user.confirmed = true
				user.register_token = null
				user.save().then(user => {
					res.status(201).json({ user, token })
				})
			} else {
				console.log("no");
			}

		});

	},

	login: (req, res) => {
		const { errors, isValid } = validateLoginInput(req.body);
		if(!isValid) return res.status(400).json(errors);

		const email = htmlspecialchars(req.body.email);
		const password = htmlspecialchars(req.body.password);

		User.findOne({email})
		.then(user => {
			if (!user) {
				errors.email = 'User not found'
				return res.status(404).json(errors);
			}
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
		});
	},

	// Work in Progress
	loginForgotten: (req, res) => {
		const { errors, isValid } = validateLoginForgottenInput(req.body);
		if (!isValid) return res.status(400).json(errors);
		
		const email = htmlspecialchars(req.body.email);

		User.findOne({ email })
		.then(user => {
			if (!user) {
				errors.email = 'User not found';
				return res.status(404).json(errors);
			}
			// Generation d'un token
			// Enregistrement de celui-ci dans la bdd
			Mail.mailLoginForgotten(email, user.username, 'token123', res);
			res.send(`Email send to ${email}`);
		});
	},

	// Work in Progress
	loginCheckNewPassword: (req, res) => {
		const username = htmlspecialchars(req.body.username);
		const token = htmlspecialchars(req.body.token);

		console.log(req.body);

		// Checker que le token de l'user dans la bdd est le meme que celui receptionné
		// Si oui
			// res.send('OK'); 
		// Sinon
		// res.send('KO');

	},

	// Work in Progress
	loginNewPassword: (req, res) => {
		console.log(req.body);

		const { errors, isValid } = validateLoginNewPasswordInput(req.body);
		if (!isValid) return res.status(400).json(errors);

		const password = htmlspecialchars(req.body.password);
		const newPassword = bcrypt.hashSync(password, 10);

		// Hash du password
		// Enregistrement du password dans la bdd



		res.send('OK');
	},

	me: (req, res) => {
		return res.json({
			id: req.user.id,
			name: req.user.name,
			email: req.user.email
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
		// Log user out of all devices
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
		if(!isValid) return res.status(400).json(errors);
		const { userId, settings } = req.body;
	
		Object.keys(settings).forEach((key) => (settings[key] == null || settings[key] == '' || key == 'password_confirm') && delete settings[key]);
		User.findOneAndUpdate({_id: userId}, {$set : settings}, {new:true}, (err, doc) => {
			if (err) {
				errors.settings = 'Cannot update user settings';
				res.status(400).json(errors);
			} else {
				console.log(doc);
				res.status(201).json({username: doc.name || '', email: doc.email || '', langue: doc.lang || '', avatar:doc.avatar || ''});
			}
		})
	},

	getSettings: (req, res) => {
		const userId = htmlspecialchars(req.body.userId);

		User.findOne({_id: userId}, (err, doc) => {
			//console.log(doc)
			if (err)
				res.status(500).send(err);
			else
				res.status(200).json({username: doc.name || '', email: doc.email || '', langue: doc.lang || '', avatar:doc.avatar || ''});
		})
	},

	getUserInfo: (req, res) => {
		const username = htmlspecialchars(req.body.username);

		User.findOne({ username: username }, ['username', 'firstName', 'lastName', 'avatar'], (err, data) => {

			console.log(data._id);
			if (err)
				res.status(500).send(err);
			else
				res.status(200).json(data);
		});
	}
}
