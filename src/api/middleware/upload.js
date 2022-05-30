var path = require('path')
const multer=require('multer');
const fs = require('fs-extra');


const fileStrogrageEngine=multer.diskStorage({
    destination:(req,file,cb)=>{
        console.log(req.body);
        var sid="profile";
        if(req.body.session_id!=null&&req.body.session_id!=undefined){
            sid=req.body.session_id;
        }
        const dir="./temp/"+sid;
        fs.ensureDirSync(dir);
        cb(null,dir)
    },
    filename:(req,file,cb)=>{
        var sid="profile.";
        if(req.body.session_id!=null&&req.body.session_id!=undefined){
            sid=req.body.session_id+".";
        }
        cb(null,sid+Date.now()+path.extname(file.originalname));
    }
})

const upload =multer({storage:fileStrogrageEngine});

module.exports=upload;