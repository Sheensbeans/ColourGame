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

app.get( '/2D', function( req, res ){ 
    res.sendFile( __dirname + '/public/2D.html' );
});

app.get( '/3D', function( req, res ){ 
    res.sendFile( __dirname + '/public/3D.html' );
});

app.get( '/Collab', function( req, res ){ 
    res.sendFile( __dirname + '/public/Collab.html' );
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

socket.on('playerReady', () => {
    playersReady++;
    console.log('Player ' + socket.id + ' is ready');
        
    if (playersReady === 2) {
          // Notify all clients that both players are ready
          io.emit('bothPlayersReady');
          playersReady = 0;

        }
    });
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

socket.on('blueWins', () => {
        console.log('Blue wins!');
        // Handle any logic you want when Blue wins
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