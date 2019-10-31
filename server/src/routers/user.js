const express = require('express')
const passport = require('../middleware/passport')
const router = express.Router()

const userController = require('../controllers/user');

//Public
router.post('/register', userController.register)
router.post('/registerValidation', userController.registerValidation)
router.post('/login', userController.login)
router.post('/loginForgotten', userController.loginForgotten)
router.post('/loginNewPassword', userController.loginNewPassword)
router.post('/loginCheckNewPassword', userController.loginCheckNewPassword)


//Protected
router.get('/me', passport.authenticate('jwt', { session: false }), userController.me);
router.post('/me/logout', passport.authenticate('jwt', { session: false }), userController.logout)
router.post('/me/logoutall', passport.authenticate('jwt', { session: false }), userController.logoutall)
router.post('/getSettings', passport.authenticate('jwt', { session: false }), userController.getSettings)
router.post('/modifySettings', passport.authenticate('jwt', { session: false }), userController.modifySettings)
router.post('/getUserInfo', passport.authenticate('jwt', { session: false }), userController.getUserInfo)

module.exports = router
