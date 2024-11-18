import express from 'express';
import morgan from 'morgan';
import tourRoutes from './routes/tourRoutes.js';

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/tours', tourRoutes);

export default app;
