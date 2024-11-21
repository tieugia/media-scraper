import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mediaRoutes from './presentation/routes/media.route';
import { errorHandler } from './presentation/middlewares/errorHandler.middleware';
import authMiddleware from './presentation/middlewares/auth.middleware';
import bodyParser from 'body-parser';

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(authMiddleware);
app.use(errorHandler);
app.use('/api/media', mediaRoutes);

export default app;
