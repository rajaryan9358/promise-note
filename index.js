var express=require('express');
var bodyParser = require('body-parser');

const multer=require('multer');
var app=express();

const {setUserOnline,setUserOffline}=require('./src/api/controllers/user.status.controller');

var http = require('http').Server(app);
var io = require('socket.io')(http);

const { now } = require('moment');

var auth=require('./src/api/routes/auth.route');
var user=require('./src/api/routes/user.route');
var note=require('./src/api/routes/note.route');
var chat=require('./src/api/routes/chat.route');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('socket',io);

app.use('/auth',auth);
app.use('/user',user);
app.use('/note',note);
app.use('/chat',chat);


io.on('connection', function(socket){
    console.log('A user connected');
    var handshakeData = socket.request;
    var onlineData={
        user_id:handshakeData._query['user_id'],
        socket_id:socket.id,
        last_seen:now(),
    };

    setUserOnline(onlineData,function(data){
        console.log("User set online");
    });
    
    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
       console.log('A user disconnected');
       var offlineData={
           socket_id:socket.id,
           last_seen:now(),
       };

       setUserOffline(offlineData,function(data){
           console.log("User set offline");
       });

    });
 });

http.listen(3000,function(){
    console.log("Connected");
})
