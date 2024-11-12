// 1. IMPORTS
const dotenv = require('dotenv').config(); // Load environment variables
const { app } = require(`${__dirname}/app`);

// 2. START SERVER
const SERVER_PORT = process.env.PORT || 3000;
app.listen(SERVER_PORT, 'localhost', () => {
  console.log(`Server is running on http://localhost:${SERVER_PORT}`);
});
