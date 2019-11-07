const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateSettingsInput = (data) => {
    let errors = {};
    const {
        settings
    } = data;

    settings.oAuth = !isEmpty(settings.oAuth) ? settings.oAuth : '';
    settings.avatar = !isEmpty(settings.avatar) ? settings.avatar : '';
    settings.lang = !isEmpty(settings.lang) ? settings.lang : '';

    if (Validator.isEmpty(settings.avatar))
        errors.avatar = 'Avatar cannot be empty';

    if (settings.avatar && !Validator.isLength(settings.avatar, 1))
        errors.avatar = 'Avatar must have 1 chars';

    if (settings.avatar < '1' && settings.avatar > '9')
        errors.avatar = 'Avatar is incorrect';

    if (Validator.isEmpty(settings.lang))
        errors.lang = 'Lang field cannot be empty';

    if (settings.lang && !Validator.isLength(settings.lang, 2))
        errors.lang = 'Lang must have 2 chars';

    if (settings.oAuth === false) {
        settings.email = !isEmpty(settings.email) ? settings.email : '';
        settings.firstName = !isEmpty(settings.firstName) ? settings.firstName : '';
        settings.lastName = !isEmpty(settings.lastName) ? settings.lastName : '';
        settings.password = !isEmpty(settings.password) ? settings.password : '';
        settings.password_confirm = !isEmpty(settings.password_confirm) ? settings.password_confirm : '';

        if (settings.password.length > 0) {
            if (settings.password && !Validator.isLength(settings.password, {
                    min: 7,
                    max: 30
                }))
                errors.password = 'Password must have 7 chars';
            if (settings.password && settings.password_confirm && !Validator.equals(settings.password, settings.password_confirm))
                errors.password = 'Password and Confirm Password must match';
        }

        if (!Validator.isEmail(settings.email))
            errors.email = 'Email is invalid';

        if (Validator.isEmpty(settings.email))
            errors.email = 'Email is required';

        if (!Validator.isLength(settings.firstName, {
                min: 3,
                max: 50
            }))
            errors.firstName = 'First name must be between 3 and 50 characters';

        if (Validator.isEmpty(settings.firstName))
            errors.firstName = 'First name field cannot be empty';

        if (!Validator.isLength(settings.lastName, {
                min: 3,
                max: 50
            }))
            errors.lastName = 'Last name must be between 3 and 50 characters';

        if (Validator.isEmpty(settings.lastName))
            errors.lastName = 'Last name field cannot be empty';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}