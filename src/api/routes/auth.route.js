const express=require('express');
const {sendOtp,verifyOtp,createAccount}=require('../controllers/auth.controller');
const uploader =require('../middleware/upload');

const router=express.Router();


router.post('/send-otp',sendOtp);
router.post('/verify-otp',verifyOtp);
router.post('/create-account',uploader.single('image'),createAccount)

module.exports=router;