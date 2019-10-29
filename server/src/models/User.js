const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email address')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        maxLength: 30
	},
    username : {type : String, required:true, max:50, min:3},
    firstName : {type : String, required:true, max:50, min:3},
    lastName : {type : String, required:true, max:50, min:3},
	lang:{type : String, default:'en', max:10, min:3},
	githubId:{type: Number, min:1, max:100000000},
	avatar: {type : String, max:256, min:10},
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({
		_id: user._id,
		username: user.username
	}, process.env.JWT_KEY, {expiresIn: 3600})
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

const User = mongoose.model('User', userSchema)

module.exports = User
