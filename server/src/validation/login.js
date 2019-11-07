const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateLoginInput = (data) => {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if (Validator.isEmpty(data.email))
        errors.email = 'Email or username is required';

    if (!Validator.isLength(data.password, {
            min: 7,
            max: 30
        }))
        errors.password = 'Password must have 7 chars';

    if (Validator.isEmpty(data.password))
        errors.password = 'Password is required';

    return {
        errors,
        isValid: isEmpty(errors)
    }
}