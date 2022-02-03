const mongoose = require('mongoose');
const logger= require('./winstonLogger');

module.exports=async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGOURL}/flick?authSource=admin`,{
            useUnifiedTopology: true,
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false
        });        
        logger.info(`Mongodb Connected`);
    }catch(err){
        logger.error(""+err);
        process.exit(1);
    }
}