const express=require('express');
const{createNote,acceptNote,withdrawNote,getNoteRequests,getMyNotes,getNoteDetails,uploadNoteImage,generatePdf}=require('../controllers/note.controller');
const verifyToken=require('../../config/verify-token');
const uploader =require('../middleware/upload');


const router=express.Router();

router.post('/create',verifyToken,createNote)
router.post('/accept',verifyToken,acceptNote);
router.post('/withdraw',verifyToken,withdrawNote);
router.post('/note-requests',verifyToken,getNoteRequests);
router.post('/my-notes',verifyToken,getMyNotes);
router.get('/detail/:note_id/:user_id',verifyToken,getNoteDetails);
router.post('/generate-pdf',verifyToken,generatePdf);
router.post('/upload-image',uploader.single("image"),uploadNoteImage);

module.exports=router;