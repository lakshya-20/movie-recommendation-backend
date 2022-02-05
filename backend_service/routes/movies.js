const express = require('express')
const mongoose = require('mongoose')
const sanitize = require('mongo-sanitize');
const logger=require('../util/winstonLogger');
const {Movies_data} =  require('../models/movie');
const router = express.Router()
const elastic_client = require('../util/elasticsearchClient');

// @route   Get api/movies
// @desc    Get list of all movies
// @access  Public
router.get('/',async(req,res)=>{    
    try{
        if(process.env.NODE_ENV==="development"){
            const redisClient=require('../util/redisClient');
            redisClient.get("movies",async (err,data)=>{            
                if(err){
                    logger.error(`${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
                    res.status(500).send("Server Error");
                }
                if(data!=null){                                                
                    res.send(JSON.parse(data));
                }
                else{                
                    const movies= await Movies_data.find();
                    redisClient.setex("movies",3600,JSON.stringify(movies));
                    res.json(movies);
                }            
            })
        }
        else {
            const movies= await Movies_data.find();
            res.json(movies);
        }
    }catch(err){
        logger.error(`${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        res.status(500).send('Server Error');
    }    
})

// @route   Get api/movies/recommendation
// @desc    Get list of 10 movies (dumnmy recommendations) having highest ratings
// @access  Public
router.get('/recommendations',async(req,res)=>{    
    try{        
        const movies= await Movies_data.find().sort({"imdb_score": -1}).limit(10);
        res.json(movies);
    }catch(err){
        logger.error(`${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        res.status(500).send('Server Error');
    }    
})

// @route   Get api/movies/:movieId
// @desc    Get details of a movie
// @access  Public
router.get('/:movieId',async (req,res)=>{    
    var movieId=sanitize(req.params.movieId);    
    try{
        movieId=mongoose.Types.ObjectId(movieId);
        const movie= await Movies_data.findById(movieId);
        res.json(movie);
    }catch(err){
        logger.error(`${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        res.status(500).send("Server Error");
    }
})

// @route   Get api/movies/find/:title
// @desc    Find movie by title
// @access  Public
router.get('/find/:title', async (req,res) => {
    const title = sanitize(req.params.title);
    try{
        const movie= await Movies_data.find({title: { $regex: `^${title}.*$`, $options: 'i' }}).limit(10);
        res.json(movie);
    } catch(err){
        logger.error(`${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        res.status(500).send("Server Error");
    }
})

// @route   Get api/movies/search
// @desc    Filter movies by title, genre, imdb_score (elasticsearch)
// @access  Public
router.post("/search", async (req, res) => {
    const search_param = sanitize(req.body);    
    function getQueries(search_param, filter_key = null, is_pre_filter = false){
        queries = [];
        for( key in search_param){
            if(is_pre_filter === true){
                if(search_param[key]["type"] === "text" && search_param[key]["present"] === true){
                    queries.push({
                        match: {
                            [key]: {
                                query: search_param[key]["value"],
                                fuzziness: "AUTO",
                                prefix_length: 3
                            }
                        }
                    });
                }
            }
            else{
                if(search_param[key]["present"] === true){
                    if(key === filter_key) continue;
                    else if (search_param[key]["type"] === "checkbox"){
                        if (key === "genres"){
                            queries.push({                                
                                terms: { [`${key}.keyword`]: search_param[key]["values"] }
                            });
                        }
                        else {
                            queries.push({
                                match: {
                                    [key]: search_param[key]["value"]                                
                                }
                            })
                        }
                        
                    }
                    else if (search_param[key]["type"] === "range"){
                        queries.push({
                            range: {
                                [key]: {
                                    gte: search_param[key]["value"]["min"],
                                    lte: search_param[key]["value"]["max"]
                                }
                            }
                        });
                    }

                }
            }
        }
        return {must: queries};
    }

    function getAggregations(search_param){
        aggregations = {};
        for( key in search_param){
            if (search_param[key]["type"] === "range"){
                aggregations[key+"_range"] = {
                    filter: {
                        bool: getQueries(search_param, key, false)
                    },
                    aggs: {
                        [`${key}_min`]: { min: { field: key } },
                        [`${key}_max`]: { max: { field: key } }
                    }
                };
            }                    
            else if (search_param[key]["type"] === "checkbox") {
                key_copy = key;
                aggregations[key_copy] = {
                    filter: {
                        bool: getQueries(search_param, key_copy, false)
                    },
                    aggs: {
                        [key_copy]: { "terms": { "field": key_copy==="genres"? `${key_copy}.keyword`: key_copy }}
                    }
                }
            }
        }
        return aggregations;
    }
    console.log(JSON.stringify(getQueries(search_param, null, false)));
    const movies = await elastic_client.search({
        index: 'flick',
        body: {
            query: {
                bool: getQueries(search_param, null, true)
            },
            aggs: await getAggregations(search_param),
            post_filter: {  
                bool: getQueries(search_param, null, false)
            }
        }
    })

    function structure_response (search_param, body){
        var response = {}
        response["movies"] = body["hits"]["hits"].map(movie => movie["_source"])
        response["filter_params"] = {}
        for( key in search_param){
            if (search_param[key]["type"] === "range"){
                response["filter_params"][key+"_range"] = {
                    min: body["aggregations"][`${key}_range`][`${key}_min`]["value"],
                    max: body["aggregations"][`${key}_range`][`${key}_max`]["value"]
                }
            }
            else if (search_param[key]["type"] === "checkbox") {
                response["filter_params"][key] = body["aggregations"][key][key]["buckets"].map(bucket => bucket["key"]);
            }
        }
        return response;
    }
    res.json(structure_response(search_param, movies["body"]));
})
module.exports=router