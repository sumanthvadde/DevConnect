const express= require("express");
const router = express.Router();
const auth = require('../../middlewares/auth');

const bcrypt= require('bcryptjs');
const jwt = require('jsonwebtoken');

const User= require('../../models/Users.js')
const { check, validationResult}= require('express-validator/check')

router.get('/', auth,  async (req,res)=>{
    try{
        const user= await User.findById(req.user.id).select('-password');
        res.json(user);
    }
    catch(err){
            console.error(err.message);
            res.status(500).send('Server Error'); 
    }
});

router.post('/', 
[
    check('email', 'Please include email').isEmail(),
    check('password', 'Please include password with 6 or more char').exists()
],
    async (req,res)=>{
        const errors= validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors : errors.array()});
        }

        const { email , password}= req.body;
        try{
            let user = await User.findOne({email});
            if(! user){
               return res.status(400).json({ errors: [{msg: 'Invalid Credentials'}]});
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if(! isMatch){
                return res.status(400).json({ errors: [{msg: 'Invalid Credentials'}]});
             }
            
            
            const payload={
                user:{
                    id: user.id
                }
            }
            //return jsonwebtoken
            jwt.sign(payload, 'sumanth@secret', { expiresIn: 360000},(err, token)=>{
                    if(err) throw err;
                    res.json({token});
            });
   
        }
        catch(err) {
                console.error(err.message);
                res.status(500).send("Error Message");
        }


 });



module.exports= router;