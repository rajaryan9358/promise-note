const {getMyChats,getChatMessages,sendNewMessage}=require('../services/chat.service');
const uploader =require('../middleware/upload');


module.exports={
    getMyChats:(req,res)=>{
        getMyChats(req.body,function(error,result){
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
                    message:result.message,
                    data:result.data,
                });
            }
        })

    },

    getChatMessages:(req,res)=>{
        getChatMessages(req.body,function(error,result){
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
                });
            }
        })
    },

    sendNewMessage:(req,res)=>{
        var filename="";
        if(req.body.is_image==1&&req.file!=null){
            filename=req.file.filename;
        }else if(req.body.is_image==0){
            filename="";
        }else{
            return res.json({
                status:"FAILED",
                message:"Failed to send message",
            });
        }

        req.image_name=filename;

        sendNewMessage(req.body,function(error,result){
            if(error){
                if(error.code==500){
                    return res.json({
                        status:"FAILED",
                        code:error.code,
                        message:"Database connection error",
                        error:error
                    });
                }else{
                    return res.json({
                        status:"FAILED",
                        code:error.code,
                        message:error.message,
                    });
                }
            }else{
            var io=req.app.get('socket');
            const socketId=result.socket_id;
            io.to(socketId).emit('new-message',result);

                return res.json({
                    status:"SUCCESS",
                    code:result.code,
                    message: result.message,
                    data:result.data,
                });
            }
        });
    }
}