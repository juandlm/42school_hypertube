const User = require('../models/User')

const bcrypt = require('bcryptjs')
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
const validateSettingsInput = require('../validation/settings');

module.exports = {

	register: (req, res) => {

		console.log(req.body)

		const { errors, isValid } = validateRegisterInput(req.body);

		if (!isValid) {
			return res.status(400).json(errors);
		}
		User.find({$or: [{ username: req.body.username }, { email: req.body.email }]}).then(user => {
			if (user == '') {
				const newUser = new User({
					username: req.body.username,
					email: req.body.email,
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					password: req.body.password,
					password_confirm: req.body.password_confirm,
				});

				bcrypt.genSalt(10, (err, salt) => {
					if (err) console.error('There was an error', err);
					else {
						bcrypt.hash(newUser.password, salt, async (err, hash) => {
							if (err) console.error('There was an error', err);
							else {
								newUser.password = hash;
								const token = await newUser.generateAuthToken()
								newUser
								.save()
								.then(user => {
									res.status(201).json({ user, token })
								});
							}
						});
					}
				});
			}
			else if (user[0].email == req.body.email) {
				return res.status(400).json({
					email: 'Email already exists'
				});
			} else if (user[0].username == req.body.username) {
				return res.status(400).json({
					username: 'Username already exists'
				});
			}
		}).catch(err => console.error(err));
	},

	login: (req, res) => {

		const { errors, isValid } = validateLoginInput(req.body);

		if(!isValid) {
			return res.status(400).json(errors);
		}

		const email = req.body.email;
		const password = req.body.password;

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
		if(!isValid) return res.status(400).json(errors);
		
		const email = htmlspecialchars(req.body.email);
		console.log(email);

		User.findOne({ email })
		.then(user => {
			if (!user) {
				errors.email = 'User not found';

				//test
				Mail.mailLoginForgotten(email, 'roro', 'testToken', res);

				return res.status(404).json(errors);
			}

			// envoi du mail ici
			// Mail.mailLoginForgotten(email, user.username, user.token, res);

			console.log('OK');
			res.send('OK');
		});
	},

	// Work in Progress
	loginNewPassword: (req, res) => {
		console.log(req.body);

		const { errors, isValid } = validateLoginNewPasswordInput(req.body);
		if(!isValid) return res.status(400).json(errors);


		const password = htmlspecialchars(req.body.password);

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
		const { errors, isValid } = validateSettingsInput(req.body)
		if(!isValid) {
			return res.status(400).json(errors)
		}
		const {userId, settings} = req.body
		Object.keys(settings).forEach((key) => (settings[key] == null || settings[key] == '' || key == 'password_confirm') && delete settings[key]);
		User.findOneAndUpdate({_id: userId}, {$set : settings}, {new:true}, (err, doc) => {
			if (err){
				errors.settings = 'Cannot update user settings'
				res.status(400).json(errors)
			} else{
				console.log(doc)
				res.status(201).json({username: doc.name || '', email: doc.email || '', langue: doc.lang || '', avatar:doc.avatar || ''})
			}
		})
	},

	getSettings: (req, res) => {
		User.findOne({_id: req.body.userId}, (err, doc) => {
			//console.log(doc)
			if (err)
				res.status(500).send(err)
			else
				res.status(200).json({username: doc.name || '', email: doc.email || '', langue: doc.lang || '', avatar:doc.avatar || ''})
		})
	},

	getUserInfo: (req, res) => {
		//htmlspecialchars
		// console.log(req.body.username)
		User.findOne({username: req.body.username}, ['username', 'firstName', 'lastName', 'avatar'], (err, data) => {
			if (err)
				res.status(500).send(err)
			else
				res.status(200).json(data)
		})
	}
}
