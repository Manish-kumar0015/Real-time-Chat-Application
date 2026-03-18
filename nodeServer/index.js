// node server will handle socket.io connections

const { Server } = require("socket.io");

// IMPORTANT: use dynamic port (for deployment)
const PORT = process.env.PORT || 8000;

const io = new Server(PORT, {
    cors: {
        origin: "*"
    }
});

const users = {};

io.on('connection', socket => {

    // if any new user join, let other users know
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // if someone sends a message
    socket.on('send', message => {
        socket.broadcast.emit('receive', {
            message: message,
            name: users[socket.id]
        });
    });

    // if someone disconnects
    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });

});

// just to confirm server is running
console.log(`Server running on port ${PORT}`);