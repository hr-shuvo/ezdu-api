import express from 'express';
import 'express-async-errors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import authRouter from "./routes/authRouter.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { authenticateUser } from "./middleware/authMiddleware.js";
import userRouter from "./routes/userRouter.js";
import courseRoute from "./routes/courseRoute.js";
import moduleRouter from "./routes/moduleRoute.js";
import unitRouter from "./routes/unitRouter.js";
import lessonRouter from "./routes/lessonRoute.js";
import challengeRouter from "./routes/challengeRoute.js";
import userProgressRoute from "./routes/userProgressRoute.js";
import { seedData } from "./utils/seedData.js";
import academyRouter from "./routes/academyRouter.js";
import challengeProgressRouter from "./routes/challengeProgressRouter.js";


dotenv.config();
const app = express();


if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


app.use(cookieParser());
app.use(express.json());

const allowedOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : [];
// console.log('Allowed origins from env:', allowedOrigins);

// app.use(
//     cors({
//         origin: function (origin, callback) {
//             if (!origin || allowedOrigins.includes(origin)) {
//                 callback(null, true);
//             } else {
//                 callback(new Error('Not allowed by CORS: ' + origin));
//             }
//         },
//         credentials: true,
//     })
// );

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true
    })
)


app.get('/', async (req, res) => {

    res.send({_: 'Hello World', host: allowedOrigins.length, env: process.env.NODE_ENV});
});

app.get('/api/v1', (req, res) => {
    res.json({
        msg: 'API is running',
        environment: process.env.NODE_ENV,
        production: process.env.NODE_ENV === 'production'
    });
});
// Routers
app.get('/api/v1/seed', seedData);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', authenticateUser, userRouter);
app.use('/api/v1/modules', authenticateUser, moduleRouter);
app.use('/api/v1/courses', authenticateUser, courseRoute);
app.use('/api/v1/units', authenticateUser, unitRouter);
app.use('/api/v1/lessons', authenticateUser, lessonRouter);
app.use('/api/v1/challenges', authenticateUser, challengeRouter);
app.use('/api/v1/userProgress', authenticateUser, userProgressRoute);
app.use('/api/v1/challengeProgress', authenticateUser, challengeProgressRouter);

app.use('/api/v1/academy', academyRouter);


app.use('*', (req, res) => {
    res.status(404).json({ error: 'route not found' });
});

// Middlewares
app.use(errorHandlerMiddleware);


const PORT = process.env.PORT || 5000;
try {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
} catch (e) {
    console.error(e);
    process.exit(1);
}

