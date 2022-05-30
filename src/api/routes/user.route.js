const express=require('express');
const{getUserDetail,updateProfile,searchParty,sendInvite}=require('../controllers/user.controller');
var verifyToken=require('../../config/verify-token');
const uploader =require('../middleware/upload');

const router=express.Router();

router.get('/detail/:user_id',verifyToken,getUserDetail);
router.post('/profile',uploader.single('image'),verifyToken,updateProfile);
router.get('/search/:phone',verifyToken,searchParty);
router.get('/invite/:phone',verifyToken,sendInvite);

module.exports=router;