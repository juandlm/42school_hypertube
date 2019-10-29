const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};
    data.username = !isEmpty(data.username) ? data.username : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.firstName = !isEmpty(data.firstName) ? data.firstName : '';
    data.lastName = !isEmpty(data.lastName) ? data.lastName : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password_confirm = !isEmpty(data.password_confirm) ? data.password_confirm : '';

    if(!Validator.isLength(data.username, { min: 3, max: 50 })) {
        errors.username = 'Username must be between 3 and 50 characters';
    }
    
    if(Validator.isEmpty(data.username)) {
        errors.username = 'Username field cannot be empty';
    }

    if(!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    if(Validator.isEmpty(data.email)) {
        errors.email = 'Email is required';
    }

    if(!Validator.isLength(data.firstName, { min: 3, max: 50 })) {
        errors.firstName = 'First name must be between 3 and 50 characters';
    }
    
    if(Validator.isEmpty(data.firstName)) {
        errors.firstName = 'First name field cannot be empty';
    }

    if(!Validator.isLength(data.lastName, { min: 3, max: 50 })) {
        errors.lastName = 'Last name must be between 3 and 50 characters';
    }
    
    if(Validator.isEmpty(data.lastName)) {
        errors.lastName = 'Last name field cannot be empty';
    }

    if(!Validator.isLength(data.password, {min: 7, max: 30})) {
        errors.password = 'Password must have be at least 7 characters long';
    }

    if(Validator.isEmpty(data.password)) {
        errors.password = 'Password is required';
    }

    if(!Validator.isLength(data.password_confirm, {min: 7, max: 30})) {
        errors.password_confirm = 'Password must have be at least 7 characters long';
    }

    if(!Validator.equals(data.password, data.password_confirm)) {
        errors.password_confirm = 'Password and Confirm Password must match';
    }

    if(Validator.isEmpty(data.password_confirm)) {
        errors.password_confirm = 'Password is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}