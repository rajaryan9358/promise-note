const express=require('express');
const{getMyChats,getChatMessages,sendNewMessage}=require('../controllers/chat.controller');
var verifyToken=require('../../config/verify-token');
const uploader =require('../middleware/upload');

const router=express.Router();

router.post('/my-chats',verifyToken,getMyChats)
router.post('/chat-messages',verifyToken,getChatMessages);
router.post('/new-message',uploader.single('image'),verifyToken,sendNewMessage);


module.exports=router;