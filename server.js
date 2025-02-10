import * as dotenv from "dotenv";
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from "cookie-parser";
import cors from 'cors';
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import authRouter from "./routes/authRouter.js";


dotenv.config();
const app = express();


app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL.split(','), credentials: true }));


app.get('/', (req, res) => {
    res.send('Hello EZDU');
});

app.get('/api/v1', (req, res) => {
    res.json({msg:'API is running'});
});

// Router
// Routers
app.use('/api/v1/auth', authRouter);



app.use('*', (req, res) => {
    res.status(404).json({error: 'route not found'});
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
