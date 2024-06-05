const express= require('express');
const app= express();
const http= require('http').createServer(app);
const path= require('path');

const dotenv= require('dotenv');
const { monitorEventLoopDelay } = require("perf_hooks");
dotenv.config({ path: './config.env'});

const PORT= process.env.PORT || 5000;

http.listen(PORT, ()=> {
    console.log(`LISTENING ON PORT ${PORT}`);
});

app.use(express.static(path.join(process.cwd(), 'public'))); 

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), '/index.html'));
});

// we need to setup and configure socket.io in both server and client site js

const io= require('socket.io')(http);
io.on('connection', (socket)=> {
    console.log('Connected ....');

    // We have emmitted event from client side (see client.js), now we can listen to that event ('anyName') in server site
    socket.on('anyName', (msg) => {
        // console.log(msg); // That object that we have passed in client side
        
        // So, we've recieved our message from client to server, now send this message to all other user who are connected to this socket (or server)
        socket.broadcast.emit('anyName2', msg); // broadcast will emit event ('anyName2') to all other connected user (except self)
    });
});
