// node server will handle socket.io connections

const { Server } = require("socket.io");

const io = new Server(8000, {
    cors: {
        origin: "*"
    }
});

const users = {};

io.on('connection', socket => {
// if any new user join, let other user connected to the server know
    socket.on('new-user-joined', name => {
        // console.log("New user:", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });
// if someone send the message , broadcast to all other people
    socket.on('send', message => {

        socket.broadcast.emit('receive', {
            message: message,
            name: users[socket.id]
        });

    });
    // if someone leave the chat , let others know
    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });

});