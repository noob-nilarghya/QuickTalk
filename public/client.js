const socket= io(); // this variable is available to client.js cox it is decleared after '/socket.io/socket.io.js' in 'index.html' 

// jab tak user apna name nhi dalega, keep showing this prompt
let userName;
while(!userName){
    userName= prompt('Please enter your name: ');
}

const msgArea= document.querySelector('.message__area');

function scollToBottom(){
    msgArea.scrollTop = msgArea.scrollHeight; // scroll to last message
}

function appendMsg(msg, type){
    // create message Div
    const mainDiv= document.createElement('div');
    mainDiv.classList.add(type);    
    mainDiv.classList.add('message');    

    const markup= `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `;
    mainDiv.innerHTML= markup;

    // Append this message Div to message area
    msgArea.appendChild(mainDiv);

    // scroll to bottom
    scollToBottom();
}




//                                 -------------------- SENDING MESSAGE -----------------------

function sendMsg(message){
    const msg= {
        user: userName,
        message: message.trim()
    }

    // append to DOM
    appendMsg(msg, 'outgoing'); 

    // send to server (via websocket connection);
    socket.emit('anyName', msg); // 1st param is event name (can be any name), 2nd param is msg object
    // Now after emiting, we can listen this event 'anyName' in server. See server.js. In server.js, we will broadcast this msg to all other user that are coonected to this server
}

const textArea= document.querySelector('#textarea');
textArea.addEventListener('keyup', (e)=> {
    if(e.key === 'Enter'){
        sendMsg(e.target.value);
        e.target.value="";
    }
});
const sendBtn= document.querySelector('.sendImg').addEventListener('click', (e) => {
    sendMsg(textArea.value);
    textArea.value="";
});




//                                 -------------------- RECIEVING MESSAGE -----------------------
// we have broadcasted to all other user. So, user need to listen to that event ('anyName2')
socket.on('anyName2', (msg) => {
    // console.log(msg); --> This will be displayed on reciever browser site (not server site)
    appendMsg(msg, 'incoming');
})