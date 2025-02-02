import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import YAML from 'yaml';
import fs from 'node:fs';
import HttpError from './utils/httpError.js';
import globalMiddlewareHandler from './middlewares/errorMiddleware.js';
import tourRoutes from './routes/tourRoutes.js';
import authRoutes from './routes/authRoutes.js';
import viewRoutes from './routes/viewRoutes.js';
import bookingsRoutes from './routes/bookingsRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';

const app = express();
app.use(
  cors({
    origin: 'https://tourify.belalmuhammad.me',
    credentials: true,
  }),
);
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views', './views');

app.use('/', viewRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);

// serve swagger
const swaggerDocument = YAML.parse(fs.readFileSync('./swagger.yaml', 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 404 handler to catch all unknown routes
app.all('*', (req, res, next) => {
  next(new HttpError(`The endpoint you requested (${req.originalUrl}) could not be found.`, 404));
});

// Global error handler to catch all errors during the request-response cycle
app.use(globalMiddlewareHandler);

export default app;
