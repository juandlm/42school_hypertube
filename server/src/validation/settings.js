const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateSettingsInput = (data) => {
  let errors = {};
  const { userId, settings } = data;

  settings.langue = !isEmpty(settings.langue) ? settings.langue : '';
  settings.name = !isEmpty(settings.name) ? settings.name : '';
  settings.email = !isEmpty(settings.email) ? settings.email : '';
  settings.password = !isEmpty(settings.password) ? settings.password : '';
  settings.password_confirm = !isEmpty(settings.password_confirm) ? settings.password_confirm : '';

  if (settings.name && !Validator.isLength(settings.name, { min: 2, max: 30 }))
      errors.name = 'Name must be between 2 to 30 chars';

  if (settings.langue && !Validator.isLength(settings.langue, { min:2, max:10 }))
      errors.langue = 'Langue must be between 2 to 10 chars';

  if (settings.email && !Validator.isEmail(settings.email))
      errors.email = 'Email is invalid';

  if (settings.password && !Validator.isLength(settings.password, { min: 6, max: 30 }))
      errors.password = 'Password must have 6 chars';

  if (settings.password_confirm && !Validator.isLength(settings.password_confirm, { min: 6, max: 30 }))
      errors.password_confirm = 'Password must have 6 chars';

  if (settings.password && settings.password_confirm && !Validator.equals(settings.password, settings.password_confirm))
      errors.password_confirm = 'Password and Confirm Password must match';

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
