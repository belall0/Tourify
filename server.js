import connectDB from './config/dbConnection.js';
import app from './app.js';

const SERVER_PORT = process.env.PORT || 3000;

await connectDB();

app.listen(SERVER_PORT, 'localhost', () => {
  console.log(`Server is running on http://localhost:${SERVER_PORT}`);
});
