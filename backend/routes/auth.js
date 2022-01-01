const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Stripe = require('stripe')
const router = express.Router();
const User = require('../models/user')
const Learner = require('../models/learner')
const middleware = require('../middleware/auth')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2020-08-27",
  });

router.post('/auth/signup',
// body('email').isEmail().withMessage("Email is invalid"),
// body('password').isLength({ min: 6 }).withMessage(" password minimum 6 charecter"),
async(req,res)=>{
 
     const {userData} =req.body
    const {email,password,confirmpassword,name,age,address,phone,licence_Picture,area,nid_picture,
        profile_picture,name_plate,car_name,model,vechicle_type
    } =userData
    
//     const validatoionErrors = validationResult(req);

//     if(!validatoionErrors.isEmpty()){
//         const errors = validatoionErrors.array().map(error => {
//             return{
//                 msg : error.msg
//             }
//         }); 
//         return res.json({errors})
//     }
//   const {name,email,password,age,phone,licence_Picture,area,nid_picture,profile_picture,vechicle_type,car_name
//     ,model,name_plate,address
// } = req.body;
  const user_email = await User.findOne({email});
  if(user_email) return res.status(400).json({errmsg: "This email already exists."});

  const passwordHash = await bcrypt.hash(password, 12)
//   const customer = await stripe.customers.create(
//     {
//       email,
//     },
//     {
//       apiKey: process.env.STRIPE_SECRET_KEY,
//     }
//   );
  const newUser = new User({
    name:name,
    age:age,
    address:address,
    phone:phone,
    licence_picture:licence_Picture,
    area:area,
    nid_picture:nid_picture,
    profile_picture:profile_picture,
    car_name:car_name,
    model:model,
    name_palate:name_plate,
    vechicle_type:vechicle_type,
    email:email,
    password:passwordHash

})
        const access_token = createAccessToken({id: newUser._id})
        

await newUser.save()
  res.json({
      msg: 'Register Success!',
                access_token,
                user: {
                    ...newUser._doc,
                    password: '',
                }
  })
})

router.post('/learner/signup',
// body('email').isEmail().withMessage("Email is invalid"),
// body('password').isLength({ min: 6 }).withMessage(" password minimum 6 charecter"),
async(req,res)=>{
 
     const {userData} =req.body
    const {email,password,confirmpassword,name,age,address,phone,area,nid_picture,
        profile_picture,vechicle_type
    } =userData
    
//     const validatoionErrors = validationResult(req);

//     if(!validatoionErrors.isEmpty()){
//         const errors = validatoionErrors.array().map(error => {
//             return{
//                 msg : error.msg
//             }
//         }); 
//         return res.json({errors})
//     }
//   const {name,email,password,age,phone,licence_Picture,area,nid_picture,profile_picture,vechicle_type,car_name
//     ,model,name_plate,address
// } = req.body;
  const user_email = await Learner.findOne({email});
  if(user_email) return res.status(400).json({errmsg: "This email already exists."});

  const passwordHash = await bcrypt.hash(password, 12)
//   const customer = await stripe.customers.create(
//     {
//       email,
//     },
//     {
//       apiKey: process.env.STRIPE_SECRET_KEY,
//     }
//   );
  const newUser = new Learner({
    name:name,
    age:age,
    address:address,
    phone:phone,
    area:area,
    nid_picture:nid_picture,
    profile_picture:profile_picture,
    vechicle_type:vechicle_type,
    email:email,
    password:passwordHash

})
        const access_token = createAccessToken({id: newUser._id})
        

await newUser.save()
  res.json({
      msg: 'Register Success!',
                access_token,
                user: {
                    ...newUser._doc,
                    password: '',
                }
  })
})


router.post('/learner/login',async(req,res)=>{
    const {email, password}= req.body;
        console.log(req.body)
    const user = await Learner.findOne({email});
    if(!user) return res.json({errmsg: "This email does not exist."})
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) return res.json({errmsg: "email or Password is incorrect."})
    const access_token = createAccessToken({id: user._id})
    const refresh_token = createRefreshToken({id: user._id})
    res.cookie('refreshtoken', refresh_token, {
        httpOnly: true,
        path: '/api/refresh_token',
        maxAge: 30*24*60*60*1000 // 30days
    })
    res.json({
        msg: 'Login Success!',
        access_token,
        user: {
            ...user._doc,
            password: ''
        }
    })
})


router.post('/auth/login',async(req,res)=>{
    const {email, password}= req.body;

    const user = await User.findOne({email});
    if(!user) return res.json({errmsg: "This email does not exist."})
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) return res.json({errmsg: "email or Password is incorrect."})
    const access_token = createAccessToken({id: user._id})
    const refresh_token = createRefreshToken({id: user._id})
    res.cookie('refreshtoken', refresh_token, {
        httpOnly: true,
        path: '/api/refresh_token',
        maxAge: 30*24*60*60*1000 // 30days
    })
    res.json({
        msg: 'Login Success!',
        access_token,
        user: {
            ...user._doc,
            password: ''
        }
    })
})
const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '30d'})
}

router.get('/cehck',middleware,async(req,res,)=>{
    const user =req.user
   res.json({
    user: {
        id:user._id,
        email:user.email,
        stripeCustomerId:user.stripeCustomerId
    }
})
})
module.exports = router
