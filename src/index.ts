import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import process from "node:process";
import { dbConnection } from "./database/index.ts";
import { authRouter, eventsRouter } from "./routes/index.ts";


dotenv.config();
// Create Express Server
const app = express();

const port = process.env.PORT || 3000;

// Database
dbConnection();

// CORS
app.use(cors());

// Public Directory
app.use(express.static('public'));

// Lecture and body parse
app.use(express.json());

// Routes
// TODO: Add routes here // create, login, renew
// TODO: CRUD: Events
app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);
// Listen request
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;