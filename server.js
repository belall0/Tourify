import connectDB from './config/dbConnection.js';
import app from './app.js';
import https from 'node:https';
import http from 'node:http';
import fs from 'node:fs';

// // Load SSL Certificate
// const httpsOptions = {
//   key: fs.readFileSync('/etc/letsencrypt/live/belalmuhammad.me/privkey.pem'),
//   cert: fs.readFileSync('/etc/letsencrypt/live/belalmuhammad.me/fullchain.pem'),
// };

// // Connect to MongoDB
// await connectDB();

// const PORT = 443;
// https.createServer(httpsOptions, app).listen(443, () => {
//   console.log(`Server is running on https://localhost:${PORT} in ${process.env.NODE_ENV} environment`);
// });

// // HTTP to HTTPS Redirect
// http
//   .createServer((req, res) => {
//     res.writeHead(301, { Location: 'https://' + req.headers.host + req.url });
//     res.end();
//   })
//   .listen(80);

await connectDB();
app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000 in ${process.env.NODE_ENV} environment`);
});
