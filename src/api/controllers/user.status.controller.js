const {setUserOnline,setUserOffline}=require('../services/chat.service');


module.exports={
    setUserOnline:(data,callback)=>{
        setUserOnline(data,function(error,result){
            if(error){
                if(error.code==500){
                    return callback({
                        status:"FAILED",
                        code:error.code,
                        message:"Database connection error",
                    });
                }else{
                    return callback({
                        status:"FAILED",
                        code:error.code,
                        message:error.message,
                    });
                }
            }else{
                return callback({
                    status:"SUCCESS",
                    code:result.code,
                    message: result.message,
                    data:result.data,
                });
            }
        })
    },

    setUserOffline:(data,callback)=>{
        setUserOffline(data,function(error,result){
            if(error){
                if(error.code==500){
                    return callback({
                        status:"FAILED",
                        code:error.code,
                        message:"Database connection error",
                    });
                }else{
                    return callback({
                        status:"FAILED",
                        code:error.code,
                        message:error.message,
                    });
                }
            }else{
                return callback({
                    status:"SUCCESS",
                    code:result.code,
                    message: result.message,
                    data:result.data,
                });
            }
        })
    }
}