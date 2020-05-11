const express= require("express");
const router = express.Router();

const auth = reuqire('../../middlewares/auth');
const Profile = require('../../models/Profile');
const User= require('../../models/User');

const { check, validationResult }= require('express-validator/check');

router.get('/me', auth, async (req,res)=>{
    try{
        const profile= await  Profile.findOne({ user: req.user.id}).
        populate('user',['name', 'avatar']);

        if(!profile){
           return  res.status(500).send('No profile exists');
        }
        res.json(profile);
    }
    catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/',[
    auth,
    [
        check('status', 'Status is required').not().isEmpty(),
        check('skills', 'Skills is required').not().isEmpty()
    ]
] ,
    (req,res)=>{
        const errors= validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            company,
            location,
            website,
            bio,
            skills,
            status,
            githubusername,
            youtube,
            twitter,
            instagram,
            linkedin,
            facebook
          } = req.body;
      
          const profileFields={};
          profileFields.user= req.user.id;
          if(company)  profileFields.company= comapany
          if(website)  profileFields.wesbite= website
          if(location) profileFields.location= location
          if(bio)      profileFields.bio= bio
          if(status)   profileFields.status= status
          if(githubusername)   profileFields.githubusername= githubusername
          if(skills){
              profileFields.skills= skills.split(',').map(skill=> skill.trim());
          }
          const socialfields = { youtube, twitter, instagram, linkedin, facebook };

          for (const [key, value] of Object.entries(socialfields)) {
            if (value && value.length > 0)
              socialfields[key] = normalize(value, { forceHttps: true });
          }
          profileFields.social = socialfields;
      
          try {
            // Using upsert option (creates new doc if no match is found):
            let profile = await Profile.findOneAndUpdate(
              { user: req.user.id },
              { $set: profileFields },
              { new: true, upsert: true }
            );
            res.json(profile);
          } 
          catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
          }         

    });

    router.get('/', async(req,res)=>{
        try{
            const profiles = await Profile.find().populate('user', ['name', 'avatar']);
            if(!profiles){
                return res.status(400).send({ msg :'There is no profile'});
            }
           
            res.json(profiles);
        }
        catch(err){
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });

    router.get('/user/:user_id', async(req,res)=>{
        try{
            const profiles = await Profile.findOne({ user: req.params.user_id}).populate('user', ['name', 'avatar']);
            if(!profiles){
            return res.status(400).send({ msg :'There is no profile'});
            }
           
            res.json(profile);
        }
        catch(err){
            if(err.kind=='ObjectId'){
                return res.status(400).send({ msg :'There is no profile'}); 
            }
            res.status(500).send('Server Error');
        }
    });

router.delete('/',auth, async(req,res)=>{
    try{
        await Profile.findOneAndRemove({ user : req.user.id });
        await User.findOneAndRemove({ _id: req.user.id});
        res.json({msg: 'User Deleted'});
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports= router;