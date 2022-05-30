var mysql=require('mysql2');

var pool= mysql.createPool({
    connectionLimit:10,
    host:"localhost",
    port:8889,
    database:"promise_note",
    user:"PromiseNoteUser",
    password:"PromiseNotePassword1@"
});


var getConnection= function(callback){
    pool.getConnection(function(err,connection){
        return callback(err,connection);
     });
};

var promisePool=pool.promise();

var getPromiseConnection = async function(callback){
    return await promisePool.getConnection().then(function(connection){
         callback(null,connection);
         return callback;
    }).catch(function(error){
         callback(error,null);
         return callback;
    });
}

module.exports={getConnection,getPromiseConnection};
module.exports.secret="testsecret";