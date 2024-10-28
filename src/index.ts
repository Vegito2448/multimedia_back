import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import { createServer } from 'node:http'; // Necesario para socket.io
import process from "node:process";
import { Server } from 'socket.io'; // Socket.io
import { dbConnection } from "./database/index.ts";
import { authRouter, categoryRouter, contentRouter, finderRouter, topicRouter } from "./routes/index.ts";

config();

// Create Express Server
const app = express();
const port = process.env.PORT || 3000;

// Create HTTP server
const server = createServer(app);


// Database
dbConnection();

// CORS
app.use(cors());

// Public Directory
app.use(express.static('public'));

// Lecture and body parse
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/topics', topicRouter);
app.use('/api/content', contentRouter);
app.use('/api/search', finderRouter);

// Integrate Socket.io with the server
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// WebSocket connection
io.on('connection', (socket) => {

  console.log(`🚀 ~ io.on ~ socket:`, socket.id);

  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Listen request
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
