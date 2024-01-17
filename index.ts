// Import necessary modules
import express, { Request, Response } from 'express';
import http from 'http';
import Pusher from 'pusher-js';

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Define a route for the root path
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});


// Define a route for tracking with timestamp
app.get('/:timestamp/track.png', (req: Request, res: Response) => {
  Pusher.logToConsole = true;
  var pusher = new Pusher('51d1ffa6974c8440d2a4', {
    cluster: 'eu'
  });

  const emailData: EmailData = {
    emailSentDate: new Date(parseInt(req.params.timestamp, 10)).toLocaleString(),
    userAgent: req.headers['user-agent'],
    ipAddr: req.ip
  };

  const channel = pusher.subscribe('EmailTracker');

  channel.bind('email-read', () => {
    console.log('email-read', JSON.stringify(emailData));
  });

  res.sendFile(`${__dirname}/resources/track.png`);
});

// Start the server and listen on port 3000
server.listen(3000, () => {
  console.log('listening on *:3000');
});



export class EmailData {
  public emailSentDate: string;
  public userAgent: string | undefined;
  public ipAddr: string | undefined;

  constructor(emailSentDate: string, userAgent: string, ipAddr: string) {
    this.emailSentDate = emailSentDate;
    this.userAgent = userAgent;
    this.ipAddr = ipAddr;
  }

}