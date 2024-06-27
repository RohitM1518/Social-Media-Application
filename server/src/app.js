import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from './routes/user.route.js';
import commentRoute from './routes/comment.route.js';
import likeRoute from './routes/like.route.js';
import postRoute from './routes/post.route.js';

const app = express();
const allowedOrigins = [
    'https://fomofeed.netlify.app',
    'https://main--fomofeed.netlify.app',
    'http://localhost:5173'
];
// CORS setup
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
// Body parsing middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serve static files from public directory
app.use(express.static("public"));

// Parse cookies
app.use(cookieParser());

// Routes
app.use('/user', userRoute);
app.use('/comment', commentRoute);
app.use('/like', likeRoute);
app.use('/post', postRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export { app };
