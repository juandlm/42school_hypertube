const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateRegisterInput = (data) => {
    let errors = {};
    const regex = /^(?=.*[a-z])(?=.*[A-Z]).{7,}$/;

    data.password = !isEmpty(data.password) ? data.password : '';
    data.password_confirm = !isEmpty(data.password_confirm) ? data.password_confirm : '';

    if (!Validator.isLength(data.password, {
            min: 7,
            max: 30
        }))
        errors.password = 'Password must have be at least 7 characters long';

    if (Validator.isEmpty(data.password))
        errors.password = 'Password is required';

    if (!Validator.isLength(data.password_confirm, {
            min: 7,
            max: 30
        }))
        errors.password = 'Password must have be at least 7 characters long';

    if (!Validator.equals(data.password, data.password_confirm))
        errors.password = 'Password and Confirm Password must match';

    if (Validator.isEmpty(data.password_confirm))
        errors.password = 'Password is required';

    if (!regex.test(String(data.password)))
        errors.password = 'Password must have lowercase and uppercase characters';

    return {
        errors,
        isValid: isEmpty(errors)
    }
}