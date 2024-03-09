const express   = require('express');
const app       = express();
const http      = require('http');
const server    = require('http').createServer(app);  
const io        = require('socket.io')(server);

const LISTEN_PORT   = 8080;

app.use(express.static(__dirname + '/public')); //set root path of server ...

//our routes
app.get( '/', function( req, res ){ 
    res.sendFile( __dirname + '/public/index.html' );
});
app.get( '/redwinner', function( req, res ){ 
    res.sendFile( __dirname + '/public/redwinner.html' );
});

app.get( '/bluewinner', function( req, res ){ 
    res.sendFile( __dirname + '/public/bluewinner.html' );
});

app.get( '/game', function( req, res ){ 
    res.sendFile( __dirname + '/public/game.html' );
});
//socket.io stuff
//https://socket.io/docs/v3/emit-cheatsheet/
let playersReady = 0;

io.on('connection', (socket) => {
    console.log( socket.id + " connected" );

    socket.on('disconnect', () => {
        console.log( socket.id + " disconnected" );
    });
//------------------------Both payers must click the start button to redirect to game page-----------------------------//  
socket.on('playerReady', () => {
    playersReady++;
    console.log('Player ' + socket.id + ' is ready');
        
    if (playersReady === 2) {
          // Notify all clients that both players are ready
          io.emit('bothPlayersReady');
          playersReady = 0;

        }
    });
//-------------------------When socket get;s notif, they will change the buttons colour---------------------------//    
socket.on("blue1", (data) => {
        console.log( "blue event received" );
        console.log('Player ' + socket.id + ': colour changed');
        io.emit("color_change_blue1", {r:0, g:0, b:255});
    });
 socket.on("blue2", (data) => {
        console.log( "blue event received" );
        console.log('Player ' + socket.id + ': colour changed');
        io.emit("color_change_blue2", {r:0, g:0, b:255});
    });
socket.on("blue3", (data) => {
        console.log( "blue event received" );
        console.log('Player ' + socket.id + ': colour changed');
        io.emit("color_change_blue3", {r:0, g:0, b:255});
    });

socket.on("red1", (data) => {
        console.log( "red event received" );
        console.log('Player ' + socket.id + ': colour changed');
        io.emit("color_change_red1", {r:255, g:0, b:0});
        
    });

socket.on("red2", (data) => {
        console.log( "red event received" );
        console.log('Player ' + socket.id + ': colour changed');
        io.emit("color_change_red2", {r:255, g:0, b:0});       
}); 

socket.on("red3", (data) => {
    console.log( "red event received" );
    console.log('Player ' + socket.id + ': colour changed');
    io.emit("color_change_red3", {r:255, g:0, b:0});       
}); 

//---------------------The other person will also get this winner message (io.emit)-------------------------------//    
socket.on('checkRedWinner', () => {
    setTimeout(() => {
        io.emit('redWins', true);
        console.log('Red wins!');
    }, 500);
});


socket.on('checkBlueWinner', () => {
    setTimeout(() => {
        io.emit('blueWins', true);
        console.log('Blue wins!');
    }, 500);
});

});

    //infinite loop with a millisecond delay (but only want one loop running ...)
    //a way to update all clients simulatenously every frame i.e. updating position, rotation ...
    // if (setIntervalFunc == null) {
    //     console.log("setting interval func");
    //     setIntervalFunc = setInterval( () => {
    //         //if we want to do loops 
    //     }, 50);
    // }

server.listen(LISTEN_PORT);
console.log("Listening on port: " + LISTEN_PORT );