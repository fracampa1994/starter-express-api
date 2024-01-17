// Import necessary modules
import express, { Request, Response } from 'express';
import http from 'http';
import Pusher from 'pusher';

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Define a route for the root path
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});


// Define a route for tracking with timestamp 
app.get('/:timestamp/track.png', (req: Request, res: Response) => {
  const pusher = new Pusher({
    appId: "1742255",
    key: "51d1ffa6974c8440d2a4",
    secret: "517b8585fce75f9cb3d2",
    cluster: "eu",
    useTLS: true,
  });


  // conver req to sring
  const reqString = JSON.stringify(req.header);


  pusher.trigger('EmailTracker', 'email-read', {
    "emailSentDate": new Date().toLocaleString(),
    "userAgent": req.headers['user-agent'],
    "ipAddr": req.header('x-forwarded-for') || req.socket.remoteAddress

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