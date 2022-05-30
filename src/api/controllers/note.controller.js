const{createNote,acceptNote,withdrawNote,getNoteRequests,getMyNotes,getNoteDetails,generatePdf}=require('../services/note.service');

module.exports={
    createNote:(req,res)=>{
        createNote(req.body,async function(error,result){
            if(error){
                if(error.code==500){
                    return res.json({
                        status:"FAILED",
                        code:error.code,
                        message:"Database connection error",
                        error:error,
                    });
                }else{
                    return res.json({
                        status:"FAILED",
                        code:error.code,
                        message:error.message,
                    });
                }
            }else{
                return res.json({
                    status:"SUCCESS",
                    code:result.code,
                    message: result.message,
                    data:result.data,
                })
            }
        })
    },

    acceptNote:(req,res)=>{
        acceptNote(req.body,async function(error,result){
            if(error){
                if(error.code==500){
                    return res.json({
                        status:"FAILED",
                        code:error.code,
                        message:"Database connection error",
                    });
                }else{
                    return res.json({
                        status:"FAILED",
                        code:error.code,
                        message:error.message,
                    });
                }
            }else{
                return res.json({
                    status:"SUCCESS",
                    code:result.code,
                    message: result.message,
                    data:result.data,
                })
            }
        })
    },

    withdrawNote:(req,res)=>{
        withdrawNote(req.body,async function(error,result){
            if(error){
                if(error.code==500){
                    return res.json({
                        status:"FAILED",
                        code:error.code,
                        message:"Database connection error",
                    });
                }else{
                    return res.json({
                        status:"FAILED",
                        code:error.code,
                        message:error.message,
                    });
                }
            }else{
                return res.json({
                    status:"SUCCESS",
                    code:result.code,
                    message: result.message,
                    data:result.data,
                })
            }
        })
    },

    getNoteRequests:(req,res)=>{
        getNoteRequests(req.body,function(error,result){
            if(error){
                if(error.code==500){
                    return res.json({
                        status:"FAILED",
                        code:error.code,
                        message:"Database connection error",
                    });
                }else{
                    return res.json({
                        status:"FAILED",
                        code:error.code,
                        message:error.message,
                    });
                }
            }else{
                return res.json({
                    status:"SUCCESS",
                    code:result.code,
                    message: result.message,
                    data:result.data,
                })
            }
        })
    },

    getMyNotes:(req,res)=>{
        getMyNotes(req.body,function(error,result){
            if(error){
                if(error.code==500){
                    return res.json({
                        status:"FAILED",
                        code:error.code,
                        message:"Database connection error",
                        error:error,
                    });
                }else{
                    return res.json({
                        status:"FAILED",
                        code:error.code,
                        message:error.message,
                    });
                }
            }else{
                return res.json({
                    status:"SUCCESS",
                    code:result.code,
                    message: result.message,
                    data:result.data,
                })
            }
        })
    },

    getNoteDetails:(req,res)=>{
        const noteId=req.params.note_id;
        const userId=req.params.user_id
        getNoteDetails(noteId,userId,function(error,result){
            if(error){
                if(error.code==500){
                    return res.json({
                        status:"FAILED",
                        code:error.code,
                        message:"Database connection error",
                    });
                }else{
                    return res.json({
                        status:"FAILED",
                        code:error.code,
                        message:error.message,
                    });
                }
            }else{
                return res.json({
                    status:"SUCCESS",
                    code:result.code,
                    message: result.message,
                    data:result.data,
                })
            }
        })
    },

    uploadNoteImage:(req,res)=>{
        // console.log(req.body);
        if(req.file!=null){
            return res.json({
                status:"SUCCESS",
                message:"Image uploaded successfully",
            })
        }else{
            return res.json({
                status:"SUCCESS",
                message:"Failed to upload image",
            })
        }
    },

    generatePdf:(req,res)=>{
        res.send();
    }
}