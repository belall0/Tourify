import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import YAML from 'yaml';
import fs from 'node:fs';
import HttpError from './utils/httpError.js';
import globalMiddlewareHandler from './middlewares/errorMiddleware.js';
import tourRoutes from './routes/tourRoutes.js';
import authRoutes from './routes/authRoutes.js';
import viewRoutes from './routes/viewRoutes.js';
import swaggerUi from 'swagger-ui-express';

// Load the OpenAPI document
const swaggerDocument = YAML.parse(fs.readFileSync('./swagger.yaml', 'utf8'));

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views', './views');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/', viewRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/auth', authRoutes);

// 404 handler to catch all unknown routes
app.all('*', (req, res, next) => {
  next(new HttpError(`The endpoint you requested (${req.originalUrl}) could not be found.`, 404));
});

// Global error handler to catch all errors during the request-response cycle
app.use(globalMiddlewareHandler);

export default app;
