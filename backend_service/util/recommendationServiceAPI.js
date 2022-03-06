const logger = require('../util/winstonLogger');
const axios = require('axios');
class RecommendationServiceAPI{
    static baseUrl = process.env.RECOMMENDATION_SERVICE_URL;

    async getRecommendations(userId){
        let response = await axios({
            method: 'get',
            url: RecommendationServiceAPI.baseUrl+"recommendation/"+userId,
        })
        return response.data;
    }

    async newReview(userId, callback){
        axios({
            method: 'get',
            url: RecommendationServiceAPI.baseUrl+"newReview/"+userId,
        })
        .then(function (response) {
            callback(userId);
        })
        .catch(function (error) {
            logger.error(error);
        });
    }
}
module.exports = RecommendationServiceAPI;