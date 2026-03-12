const socket = io('http://localhost:8000');
// get DOM element in respective js variable
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
// audio that will play on recieving message
const audio = new Audio('ting.mp3');
// function which will append event info to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.appendChild(messageElement);
    if(position=='left'){
        audio.play();
    }
}
// ask new user for for his/her name and let the server known
const username = prompt("Enter your name");
append("You joined the chat", "right");
socket.emit('new-user-joined', username);
// if new user joined recieve the his/her name from the server
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
});
// if server send message recieve it
socket.on('receive', data => {

    append(`${data.name}: ${data.message}`, 'left');

});
// if user leave chat, append the info in container  
socket.on('left', name => {
    append(`${name} left the chat`, 'right');

});
// if form get submitted send to server message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';

});