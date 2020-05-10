const express= require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt= require('bcryptjs');
const jwt = require('jsonwebtoken');

const User= require('../../models/Users.js')
const { check, validationResult}= require('express-validator/check')
router.post('/', 
[   check('name', 'Name is required').not().isEmpty().
    check('email', 'Please include email').isEmail(),
    check('password', 'Please include password with 6 or more char').
    isLength({min: 6})
],
    async (req,res)=>{
        const errors= validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors : errors.array()});
        }

        const { name, email , password}= req.body;
        try{
            let user = await User.findOne({email});
            if(user){
                res.status(400).json({ errors: [{msg: 'User Already exists'}]});
            }
            const avatar = gravatr.url(email, {
                s:'200',
                r: 'pg',
                d: 'mm'
            });
        
            user= new User({
                name, email, password, avatar
            });

            const salt = await bcrypt.genSalt(10);
            user.password= await bcrypt.hash(password,salt);
            await user.save()
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