var config=require('../../config/config');
var db=config.getConnection;
var dbPromise=config.getPromiseConnection;

module.exports={
    getUserDetail:(userId,callback)=>{
        db(function(err,connection){
            if(err){
                return callback({code:500,error:err});
            }else{
                var sql="SELECT name,email,profile,phone FROM users WHERE id="+userId;
                
                connection.query(sql,function(err,results){
                    if(err){
                        return callback({code:500,error:err});
                    }else{
                        return callback(null,{code:200,message:"User details fetched successfully",data:results[0]});
                    }
                });
            }
        });
    },

    updateProfile:(data,callback)=>{
        const userId=data.user_id;
        const name=data.name;
        const email=data.email;
        const profile=data.profile;

        db(function(err,connection){
            if(err){
                return callback({code:500,error:err});
            }else{
                var update_profile_sql="UPDATE users SET name=?, email=?,profile=? WHERE id=?";

                connection.query(update_profile_sql,[name,email,profile,userId],function(err,results){
                    if(err){
                        return callback({code:500,error:err});
                    }else{
                        return callback(null,{code:200,message:"User profile updated successfully",data:null});
                    }
                })
            }
        })
    },

    searchParty:(phone,callback)=>{
        db(function(err,connection){
            if(err){
                return callback({code:500,error:err});
            }else{
                var search_party_sql="SELECT id,name,email,phone,profile FROM users WHERE phone=?";

                connection.query(search_party_sql,[phone],function(err,results){
                    if(err){
                        return callback({code:500,error:err});
                    }else{
                        if(results.length>0){
                            return callback(null,{code:200,message:"Party search fetched successfully",data:results[0]});
                        }else{
                            return callback({code:300,message:"User not found."})
                        }
                    }
                })
            }
        })
    },

    sendInvite:(data,callback)=>{
        const phone=data.phone;

        //send message to user for invitation
    },


}