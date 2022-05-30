var config=require('../../config/config');
var db=config.getConnection;
var dbPromise=config.getPromiseConnection;
const moment=require('moment');

module.exports={
    getMyChats:(data,callback)=>{
        const userId=data.user_id;

        db(function(err,connection){
            if(err){
                return callback({code:500,error:err});
            }else{
                var sql="SELECT users.id as user_id,users.name, users.phone, users.profile,chats.receiver_id,chats.id as chat_id,chats.note_id,chats.created_at,chats.updated_at FROM chats LEFT JOIN users ON users.id=chats.receiver_id WHERE chats.sender_id="+userId+" UNION SELECT users.id as user_id,users.name, users.phone, users.profile,chats.sender_id as receiver_id,chats.id as chat_id,chats.note_id,chats.created_at,chats.updated_at FROM chats LEFT JOIN users ON users.id=sender_id WHERE chats.receiver_id="+userId+" ORDER BY updated_at DESC";
           
                connection.query(sql,function(err,results){
                    if(err){
                        return callback({code:500,error:err});
                    }else{
                        return callback(null,{code:200,message:"My chats fetched successfully",data:results});
                    }
                })
            }
        })
    },

    getChatMessages:(data,callback)=>{
        const fromId=data.from_id;
        const chatId=data.chat_id;

        db(function(err,connection){
            if(err){
                return callback({code:500,error:err});
            }else{
                var sql="";
                var values=[];
                if(fromId==0){
                    sql="SELECT * FROM messages WHERE chat_id=? ORDER BY created_at DESC LIMIT 20";
                    values=[chatId];
                }else{
                    sql="SELECT * FROM messages WHERE chat_id=? AND id<? ORDER BY created_at DESC LIMIT 20";
                    values=[chatId,fromId];
                }

                connection.query(sql,values,function(err,results){
                    if(err){
                        return callback({code:500,error:err});
                    }else{
                        return callback(null,{code:200,message:"Chat messages fetched successfully",data:results});
                    }
                })
            }
        })

    },

    sendNewMessage:(data,callback)=>{
        const chatId=data.chat_id;
        const senderId=data.sender_id;
        const message=data.message;
        const isImage=data.is_image;
        const imageName=data.image_name;
        const isInNote=1;

        db(function(err,connection){
            if(err){
                return callback({code:500,error:err});
            }else{
                var sql="INSERT INTO messages(chat_id,sender_id,message,is_image,image_name,is_in_note,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)";

                const timestamp=moment.utc().format("YYYY-MM-DD HH:mm:ss")

                connection.query(sql,[chatId,senderId,message,isImage,imageName,isInNote,timestamp,timestamp],function(err,result){
                    if(err){
                        return callback({code:500,error:err});
                    }else{
                        const messageId=result.insertId;

                        connection.query("SELECT * FROM messages WHERE id="+messageId+" ORDER BY id LIMIT 1",function(err,result){
                            if(err){
                                return callback({code:301,message:"Unable to fetch message"});
                            }else{
                                return callback(null,{code:200,message:"Message sent successfully",data:result[0]});
                            }
                        })
                    }
                })
            }
        })
    },

    setUserOnline:(data,callback)=>{
        const userId=data.user_id;
        const socketId=data.socket_id;
        const lastSeen=data.last_seen;
        const isOnline=1;

        db(function(err,connection){
            if(err){
                return callback({code:500,error:err});
            }else{
                var sql="UPDATE users SET is_online=?, last_seen=?, socket_id=? WHERE id=?";

                connection.query(sql,[isOnline,lastSeen,socketId,userId],function(err,results){
                    if(err){
                        return callback({code:500,error:err});
                    }else{
                        return callback(null,{code:200,message:"User set online.",data:result});
                    }
                })
            }
        })
    },

    setUserOffline:(data,callback)=>{
        const socketId=data.socket_id;
        const lastSeen=data.last_seen;
        const isOnline=0;

        db(function(err,connection){
            if(err){
                return callback({code:500,error:err});
            }else{
                var sql="UPDATE users SET is_online=?, last_seen=? WHERE socket_id=?";

                connection.query(sql,[isOnline,lastSeen,socketId],function(err,result){
                    if(err){
                        return callback({code:500,error:err});
                    }else{
                        return callback(null,{code:200,message:"User set offline",data:result});
                    }
                })
            }
        })
    }
}