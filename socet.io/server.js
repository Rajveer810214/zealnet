const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const PORT = 5000;

// Connect to MongoDB
mongoose
    .connect('mongodb+srv://rajveer810214:XJvZX0soh0Tz86Fq@cluster0.3nxuodm.mongodb.net/SidhuCoachingCenter', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
app.use(cors());
app.use(express.json());

// Create a new private chat message schema in MongoDB
const chatSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const ChatMessage = mongoose.model('ChatMessage', chatSchema);
app.post('/api/sendMessage', async (req, res) => {
    try {
        const { sender, receiver, message } = req.body;

        const newMessage = new ChatMessage({
            sender,
            receiver,
            message,
        });
        const savedMessage = await newMessage.save();

        // Emit the message to the receiver using socket.io in their private room
        io.to(receiver).emit('message', savedMessage);

        console.log('Message saved and emitted:', savedMessage);
        res.json(savedMessage);
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/getChatHistory', async (req, res) => {
    try {
        const { currUser, name } = req.query;

        // Retrieve all chat messages between the sender and receiver
        const chatHistory = await ChatMessage.find({
            $or: [
                { sender: currUser, receiver: name },
                { sender: name, receiver: currUser },
            ],
        }).sort({ timestamp: 1 });

        res.status(200).json({ success: chatHistory });
    } catch (error) {
        console.error('Error getting chat history:', error);
        res.status(500).json({ success: 'Internal Server Error' });
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('authenticate', (roomID) => {
        // Join the room based on the user's name (roomID)
        socket.join(roomID);
        console.log('User authenticated:', roomID);
        // socket.join('userId');
        // console.log('User authenticated:', socket);
    });

    socket.on('sendMessage', (data) => {
        // Save the message to MongoDB
        const newMessage = new ChatMessage({
            sender: data.sender,
            receiver: data.receiver,
            message: data.message,
        });

        newMessage
            .save()
            .then((savedMessage) => {
                const de = [data.sender, data.receiver];
                let roomID = de.sort().join('');
                console.log(data.receiver)
                io.to(roomID).emit('message', savedMessage);
                console.log('Message saved and emitted:', savedMessage);
            })
            .catch((err) => {
                console.error('Error saving message:', err);
            });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
