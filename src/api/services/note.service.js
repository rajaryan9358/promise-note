var config=require('../../config/config');
var db=config.getConnection;
var dbPromise=config.getPromiseConnection;
const moment=require('moment');


module.exports={
    createNote:(data,callback)=>{
        const senderId=data.sender_id;
        const receiverId=data.receiver_id;
        const noteType=data.note_type;
        const noteDescription=data.note_description;
        const senderLat=data.sender_lat;
        const senderLng=data.sender_lng;
        const senderLocation=data.sender_location;
        const noteStatus="REQUESTED";

        dbPromise(async function(err,connection){
            if(err){
                return callback({code:500,error:err});
            }else{
                try{
                    await connection.beginTransaction();
                    const [response,meta]=await connection.query("SELECT COUNT(*) FROM notes GROUP BY note_id");
                    const noteCount=response.length;
                    const noteId=25000+noteCount;

                    const result =await connection.query("INSERT INTO notes(sender_id,receiver_id,note_type,note_description,sender_lat,sender_lng,sender_location,note_status,note_id) VALUES("+
                    ""+senderId+","+receiverId+",'"+noteType+"','"+noteDescription+"',"+senderLat+","+senderLng+",'"+senderLocation+",'"+noteStatus+"',"+noteId+")");


                    const [insertedNote,noteMeta]=await connection.query("SELECT * FROM notes WHERE note_id="+noteId+" ORDER BY note_id ASC LIMIT 1");

                    const note=insertedNote[0];

                    const timestamp=moment.utc().format("YYYY-MM-DD HH:mm:ss")

                    const chatDetail=await connection.query("INSERT INTO chats(note_id,sender_id,receiver_id,sender_blocked,receiver_blocked,created_at,updated_at) VALUES(?,?,?,?,?,?,?)",[note.id,note.sender_id,note.receiver_id,0,0,timestamp,timestamp]);

                    connection.commit();
                    return callback(null,{code:200,message:"New note created successfully",data:note});
                }catch(error){
                    if(connection) await connection.rollback();
                    return callback({code:500,error:error});
                }finally{
                    if(connection) await connection.release();
                }
            }
        })
    },
    
    acceptNote:(data,callback)=>{
        const noteUid=data.note_uid;
        const userId=data.user_id;
        const userLat=data.user_lat;
        const userLng=data.user_lng;
        const userLocation=data.user_location;

        db(function(err,connection){
            if(err){
                return callback({code:500,error:err});
            }else{
                var note_sql="SELECT * FROM notes WHERE id="+noteUid;

                connection.query(note_sql,function(err,results){
                    if(err){
                        return callback({code:500,error:err});
                    }else{
                        const result=results[0];

                        if(result.receiver_id==userId&&(result.note_status=="REQUESTED"||result.note_status=="AMENDED")){
                            var accept_note_sql="UPDATE notes SET receiver_lat=?,receiver_lng=?,receiver_location=?,note_status=? WHERE id=?";

                            connection.query(accept_note_sql,[userLat,userLng,userLocation,"ACCEPTED",noteUid],function(err,results){
                                if(err){
                                    return callback({code:500,error:err});
                                }else{
                                    return callback(null,{code:200,message:"Note accepted successfully",data:results})
                                }
                            })
                        }else{
                            return callback({code:300,message:"You cannot accept this note request"});
                        }
                    }
                })
            }
        })
    },

    withdrawNote:(data,callback)=>{
        const noteUid=data.note_uid;
        const userId=data.user_id;

        db(function(err,connection){
            if(err){
                return callback({code:500,error:err});
            }else{
                var note_sql="SELECT * FROM notes WHERE id="+noteUid;

                connection.query(note_sql,function(err,results){
                    if(err){
                        return callback({code:500,error:err});
                    }else{
                        const result=results[0];

                        if(result.sender_id==userId&&(result.note_status=="REQUESTED"||result.note_statu=="AMENDED")){
                            var withdraw_note_sql="UPDATE notes SET note_status=? WHERE id=?";

                            connection.query(withdraw_note_sql,["WITHDRAWN",noteUid],function(err,results){
                                if(err){
                                    return callback({code:500,error:err});
                                }else{
                                    return callback(null,{code:200,message:"Note withdrawn successfully",data:results})
                                }
                            })

                        }else{
                            return callback({code:300,message:"You cannot withdraw this note"});
                        }
                    }
                })
            }
        })
    },

    getNoteRequests:(data,callback)=>{
        const userId=data.user_id;
        const fromId=data.from_id;
        const limit=20;

        db(function(err,connection){
            if(err){
                return callback({code:500,error:err});
            }else{
                var note_requests_sql="";
                var values=[];
                if(fromId==0){
                    note_requests_sql="SELECT * FROM notes WHERE receiver_id=? AND note_status=? ORDER BY created_at DESC LIMIT ?";
                    values=[userId,"REQUESTED",limit];
                }else{
                    note_requests_sql="SELECT * FROM notes WHERE receiver_id=? AND note_status=? AND id<? ORDER BY created_at DESC LIMIT ?";
                    values=[userId,"REQUESTED",fromId,limit];
                }

                connection.query(note_requests_sql,values,function(err,results){
                    if(err){
                        return callback({code:500,error:err});
                    }else{
                        return callback(null,{code:200,message:"Note requests fetched successfully",data:results});
                    }
                })
            }
        })
    },

    getMyNotes:(data,callback)=>{
        const userId=data.user_id;
        const fromId=data.from_id;
        const limit=20;

        db(function(err,connection){
            if(err){
                return callback({code:500,error:err});
            }else{
                var note_id_sql="";
                var values=[];
                if(fromId==0){
                    note_id_sql="SELECT max(id) as id FROM notes WHERE (sender_id=? OR receiver_id=?) GROUP BY note_id ORDER BY id DESC LIMIT ?"
                    values=[userId,userId,limit];
                }else{
                    note_id_sql="SELECT max(id) as id FROM notes WHERE (sender_id=? OR receiver_id=?) AND id<? GROUP BY note_id ORDER BY id DESC LIMIT ?"
                    values=[userId,userId,fromId,limit];
                }

                connection.query(note_id_sql,values,function(err,results){
                    if(err){
                        return callback({code:500,error:err});
                    }else{
                        var my_note_sql="SELECT * FROM notes WHERE id IN (?)";


                        var noteIds=[];
                        results.forEach(element => {
                            noteIds.push(element.id);
                        });

                        console.log(noteIds);

                        if(noteIds.length>0){
                            connection.query(my_note_sql,[noteIds],function(err,results){
                                if(err){
                                    return callback({code:500,error:err});
                                }else{
                                    return callback(null,{code:200,message:"My notes fetched successfully",data:results});
                                }
                            })
                        }else{
                            return callback(null,{code:200,message:"My notes fetched successfully",data:null});
                        }

                        
                    }
                })

            }
        })
    },


    getNoteDetails:(noteId,userId,callback)=>{

        dbPromise(async function(err,connection){
            if(err){
                return callback({code:500,error:err});
            }else{
                try{
                    const [noteDetail,meta]=await connection.query("SELECT * FROM notes WHERE id="+noteId);

                    const [chatDetail,chatMeta]=await connection.query("SELECT id FROM chats WHERE note_id="+noteId+" ORDER BY id ASC LIMIT 1");
    
                    var userQuery="";
                    if(noteDetail[0].sender_id==userId){
                        userQuery="SELECT id,name,profile,phone FROM users WHERE id="+noteDetail[0].receiver_id;
                    }else{
                        userQuery="SELECT id,name,profile,phone FROM users WHERE id="+noteDetail[0].sender_id;
                    }
    
                    const [userDetail,userMeta]=await connection.query(userQuery);
    
                    var note_amendments="SELECT * FROM messages WHERE chat_id="+chatDetail[0].id+" ORDER BY created_at ASC";
    
                    const [noteAmendment,noteMeta]=await connection.query(note_amendments);
    
                    var result={
                        'note_detail':noteDetail,
                        'user_detail':userDetail,
                        'amendments':noteAmendment
                    }
    
                    return callback(null,{code:200,message:"Note details fetched successfully",data:result});
                }catch(error){
                    return callback({code:500,error:error});
                }finally{
                    if(connection) await connection.release();
                }
            }
        })
    },

    generatePdf:(data,callback)=>{
        
    }
}