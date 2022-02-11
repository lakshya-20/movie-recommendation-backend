const express = require('express')
const logger=require('../util/winstonLogger');
const router = express.Router()
const { Genres_list } = require('../models/genres');

// @route   Get api/genres/genresList
// @desc    Get list of all genres
// @access  Public
router.get('/genresList', async (req, res) => {
    try {
        var genres_list = await Genres_list.find({},{_id:0,genre:1});
        genres_list = genres_list.map(genre => genre.genre);
        res.json(genres_list);
    } catch(err){
        logger.error(`${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        res.status(500).send("Server Error");
    } 
})
module.exports = router;