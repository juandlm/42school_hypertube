const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateSettingsInput = (data) => {
    let errors = {};
    const { 
        // userId, 
        settings 
    } = data;

    settings.lang = !isEmpty(settings.lang) ? settings.lang : '';
    settings.username = !isEmpty(settings.username) ? settings.username : '';
    settings.email = !isEmpty(settings.email) ? settings.email : '';
    settings.firstName = !isEmpty(settings.firstName) ? settings.firstName : '';
    settings.lastName = !isEmpty(settings.lastName) ? settings.lastName : '';

    //   settings.avatar = !isEmpty(settings.avatar) ? settings.avatar : '';

    //   settings.password = !isEmpty(settings.password) ? settings.password : '';
    //   settings.password_confirm = !isEmpty(settings.password_confirm) ? settings.password_confirm : '';

    if (Validator.isEmpty(settings.lang))
        errors.lang = 'Lang field cannot be empty';
    
    if (settings.lang && !Validator.isLength(settings.lang, 2))
        errors.lang = 'Lang must have 2 chars';

    if (!Validator.isLength(settings.username, { min: 3, max: 50 }))
        errors.username = 'Username must be between 3 and 50 characters';
    
    if (Validator.isEmpty(settings.username))
        errors.username = 'Username field cannot be empty';

    if (!Validator.isEmail(settings.email))
        errors.email = 'Email is invalid';

    if (Validator.isEmpty(settings.email))
        errors.email = 'Email is required';

    if (!Validator.isLength(settings.firstName, { min: 3, max: 50 }))
        errors.firstName = 'First name must be between 3 and 50 characters';
    
    if (Validator.isEmpty(settings.firstName))
        errors.firstName = 'First name field cannot be empty';

    if (!Validator.isLength(settings.lastName, { min: 3, max: 50 }))
        errors.lastName = 'Last name must be between 3 and 50 characters';
    
    if (Validator.isEmpty(settings.lastName))
        errors.lastName = 'Last name field cannot be empty';

    // if (settings.password && !Validator.isLength(settings.password, { min: 6, max: 30 }))
    //     errors.password = 'Password must have 6 chars';

    // if (settings.password_confirm && !Validator.isLength(settings.password_confirm, { min: 6, max: 30 }))
    //     errors.password_confirm = 'Password must have 6 chars';

    // if (settings.password && settings.password_confirm && !Validator.equals(settings.password, settings.password_confirm))
    //     errors.password_confirm = 'Password and Confirm Password must match';

    /*if(Validator.isEmpty(userId)) {
        errors.user = 'User bad id';
    }

    if(userId && !Validator.isLength(userId, { min: 3, max: 50 })) {
        errors.user = 'User bad id';
    }*/

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
