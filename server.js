import connectDB from './config/dbConnection.js';
import app from './app.js';

const SERVER_PORT = process.env.PORT || 3000;

await connectDB();

const server = app.listen(SERVER_PORT, 'localhost', () => {
  console.log(
    `Server is running on http://localhost:${SERVER_PORT} in ${process.env.NODE_ENV} environment`,
  );
});

process.on('unhandledRejection', (err) => {
  console.error(err.name, err.message);
  console.error('Shutting down the server due to Unhandled Promise Rejection');

  // gracefully shutdown the server
  server.close(() => {
    process.exit(1);
  });
});
