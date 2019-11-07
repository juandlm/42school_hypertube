const express = require('express')
const router = express.Router()

const filmController = require('../controllers/film');

router.post('/subtitles', filmController.getSubtitle)
router.post('/getComments', filmController.getComments)
router.post('/addSeen', filmController.addSeen)
router.post('/getSeen', filmController.getSeen)
router.post('/addComments', filmController.addComments)
router.get('/films', filmController.getFilms);
router.post('/search', filmController.searchTorrent)

module.exports = router