var config=require('../../config/config');
var db=config.getConnection;
var jwt = require('jsonwebtoken');
const moment = require('moment');


module.exports={
    sendOtp:(data,callback)=>{
        const phone=data.phone;
        const otp=Math.floor(Math.random()*(9999-1000+1)+1000);
    
        db(function(err,connection){
            if(err){
                return callback({code:500,error:err});
            }else{
                connection.query("SELECT * FROM users WHERE phone="+phone,function(err,results){
                    if(err){
                        connection.release();
                        return callback({code:500,error:err});
                    }else{
                        var sql;
                        const expiryTime=moment().add(5,'m').utc().format("YYYY-MM-DD HH:mm:ss");
                        if(results.length>0){
                            //send otp to phone
                            sql="UPDATE users SET otp='"+otp+"', otp_validity='"+expiryTime+"' WHERE phone="+phone+"";
                        }else{
                            sql="INSERT INTO users(phone,otp,otp_validity) VALUES('"+phone+"','"+otp+"','"+expiryTime+"')";
                        }
    
                        connection.query(sql,function(err,results){
                            if(err){
                                connection.release();
                                return callback({code:500,error:err});
                            }else{
                                const res={
                                    phone:phone,
                                    otp:otp,
                                }
                                
                                connection.release();
                                return callback(null,{code:200,message:"Otp sent successfully",data:res});
                            }
                        });
                    }
                });
            }
        });
    },

    verifyOtp:(data,callback)=>{
        const phone=data.phone;
        const otp=data.otp;
        const token=data.token;
    
        db(function(err,connection){
            if(err){
                return callback({code:500,error:err});
            }else{
                const nowTime=moment().utc().format("YYYY-MM-DD HH:mm:ss");
                connection.query("SELECT * FROM users WHERE phone='"+phone+"' AND otp='"+otp+"'",function(err,results){
                    if(err){
                        return callback({code:500,error:err});
                    }else{
                        if(results.length>0){
                            const result=results[0];
                            if(result.otp_validity>nowTime){
                                return callback({code:300,message:"Otp expired. Resend Otp"});
                            }
                            if(result.email==null){
                                return callback(null,{code:201,message:"User account doesn't exist",data:null});
                            }
                            connection.query("UPDATE users SET token='"+token+"' WHERE phone='"+phone+"'",function(err,results){
                                if(err){
                                    return callback({code:500,error:err});
                                }else{
                                    var token=jwt.sign({user_id:result.id},config.secret);
    
                                    var responseData={
                                        'phone':phone,
                                        'name':result.name,
                                        'email':result.email,
                                        'profile':result.profile,
                                        'token':token,
                                    };
    
                                    return callback(null,{code:200,message:"Otp verified. Login successful",data:responseData});
                                }
                            });
    
                        }else{
                            return callback({code:500,error:err});
                        }
                    }
                });
            }
        }); 
    },


    createAccount:(data,callback)=>{
        const phone=data.phone;
        const name=data.name;
        const email=data.email;
        const token=data.token;
        const profile=data.profile;
    
        db(function(err,connection){
            if(err){
                return callback({code:500,error:err});
            }else{            
                var sql="UPDATE users SET name='"+name+"', email='"+email+"', token='"+token+"', profile='"+profile+"' WHERE phone='"+phone+"'";
    
                connection.query(sql,function(err,results){
                    if(err){
                        return callback({code:500,error:err});
                    }else{

                        if(results.affectedRows>0){
                        var userSql="SELECT * FROM users WHERE phone="+phone;

                        connection.query(userSql,function(err,results){
                            if(err){
                                return callback({code:500,error:err});
                            }else{
                                if(results.length>0){
                                    const result=results[0];

                                    console.log(result.id+" tt");

                                    var token=jwt.sign({user_id:result.id},config.secret);
    
                                    var responseData={
                                        'id':result.id,
                                        'phone':phone,
                                        'name':name,
                                        'email':email,
                                        'profile':result.profile,
                                        'token':token,
                                    };
                
                                    return callback(null,{code:200,message:"User account created successfully",data:responseData});

                                }else{
                                    return callback({code:302,message:"Failed to get user details"});
                                }
                            }

                        });
                        }else{
                            return callback({code:301,message:"Failed to create account"});
                        }
                    }
                })
            }
        })
    }
}