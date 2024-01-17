// Import necessary modules
import express, { Request, Response } from 'express';
import fs from 'fs';
import http from 'http';

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Define a route for the root path
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Define a route for tracking with timestamp
app.get('/:timestamp/track.png', (req: Request, res: Response) => {
  // Convert timestamp to a readable date string
  const emailSentDate = new Date(parseInt(req.params.timestamp, 10)).toLocaleString();

  // Create a log file with the timestamp in the URL
  const logFile = `${__dirname}/../logs/${req.params.timestamp}.log`;
  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, '');
    fs.appendFileSync(logFile, `## Email: ${emailSentDate}\n`);
  }

  // Log the timestamp of the request
  console.log(req.params.timestamp);
  fs.appendFileSync(logFile, `${emailSentDate}\n`);

  // Log user-agent header
  console.log(req.headers['user-agent']);
  fs.appendFileSync(logFile, `${req.headers['user-agent']}\n`);

  // Log IP address
  console.log(req.ip);
  fs.appendFileSync(logFile, `${req.ip}\n`);

  // Send the track.png file in response
  res.sendFile(`${__dirname}/resources/track.png`);
});

// Start the server and listen on port 3000
server.listen(3000, () => {
  console.log('listening on *:3000');
});
