import express from 'express';
import bodyParser from 'body-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import dotenv from 'dotenv';
import commentRoutes from "./routes/commentRoutes.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api',commentRoutes);

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});