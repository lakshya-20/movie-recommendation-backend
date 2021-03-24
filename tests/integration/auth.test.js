const {User} = require('../../models/user');
const {Review} = require('../../models/review');
const server = require('../../app');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const {JWT_SECRET}=require('../../config/key');

describe('require login middleware', () =>{
    beforeEach(()=>{
        var server = require('../../app');
    })
    afterEach(async ()=>{
        await Review.deleteMany({});
        await User.deleteMany({});
        server.close();
    })

    let token,user;

    const UserExec = async () =>{
        user = {
            name:"Test",
            email:"test@gmail.com",
            password:"12345",
            photo:" ",
            gender:"male"
        }
        user = new User(user);
        user = await user.save();
        token = jwt.sign({_id:user._id},JWT_SECRET);
    }

    const ReviewExec = () =>{

        return request(server)
            .post('/api/reviews')
            .set('Authorization',token)
            .send({
                movieId:1,
                userId:"567657589696",
                rating:8,
                comment:"Nice Movie",
            })
    }

    it('should return 401 if no token is provided', async ()=>{        
        token = '';
        const res = await ReviewExec();
        //console.log(JSON.stringify(res));
        expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid', async ()=>{
        token="invalid token"
        const res = await ReviewExec();
        expect(res.status).toBe(400);
    })

    it('should return 200 if token is valid', async () =>{
        await UserExec()
        const res = await ReviewExec();
        expect(res.status).toBe(200);
    })



})