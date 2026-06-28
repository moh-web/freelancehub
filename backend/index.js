require('dotenv').config();
const express        = require('express');
const http           = require('http');
const { Server }     = require('socket.io');
const cookieParser   = require('cookie-parser');
const cors           = require('cors');
const connectDB      = require('./src/config/db');
const authRoutes     = require('./src/routes/authRoutes');
const jobRoutes      = require('./src/routes/jobRoutes');
const proposalRoutes = require('./src/routes/proposalRoutes');
const messageRoutes  = require('./src/routes/messageRoutes');
const errorHandler   = require('./src/middleware/errorHandler');
const socketHandler  = require('./src/socket/socketHandler');

connectDB();
const app    = express();
const server = http.createServer(app);
const io     = new Server(server, { cors: { origin: '*', credentials: true } });


app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',      authRoutes);
app.use('/api/jobs',      jobRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/messages',  messageRoutes);
app.use(errorHandler);

socketHandler(io);
server.listen(process.env.PORT, () => console.log(`Server + Socket.io on port ${process.env.PORT}`));