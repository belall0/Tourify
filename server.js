import connectDB from './config/dbConnection.js';
import app from './app.js';

await connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} in ${process.env.NODE_ENV} environment`);
});
