const express = require("express");
const router = express.Router();
const multer = require('../../app/helper/multer');

const { allMovies, postMovie } = require('../../app/controller/MovieController');

router.get('/', allMovies);
router.post('/add', multer.single('file'), postMovie);

module.exports = router;