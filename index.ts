// Import necessary modules
import express, { Request, Response } from 'express';
import http from 'http';
import Pusher from 'pusher';
import IPinfoWrapper from "node-ipinfo";
import dotenv from 'dotenv';

const app = express();
const server = http.createServer(app);

const pusherAppId = process.env.PUSHER_APP_ID || '';
const pusherKey = process.env.PUSHER_APP_KEY || '';
const pusherSecret = process.env.PUSHER_APP_SECRET;
const pusherCluster = process.env.PUSHER_APP_CLUSTER || '';



app.get('/:timestamp/track.png', async (req: Request, res: Response) => {
  console.log( "Pusher App ID: "+pusherAppId);
  console.log( "Pusher Key: "+pusherKey);
  console.log( "Pusher Secret: "+pusherSecret);

  console.log( "Pusher Cluster: "+pusherCluster);
  console.log( "IP Info Key: "+process.env.IP_INFO_KEY);
  
    console.log( "Email: "+req.params.timestamp);

  dotenv.config();
  const pusher = new Pusher({
    appId: pusherAppId,
    key: pusherKey,
    secret: pusherSecret!,
    cluster: pusherCluster,
    useTLS: true,
  });


  var ip = req.header('x-forwarded-for') || req.socket.remoteAddress!;
  const ipinfoWrapper = new IPinfoWrapper(process.env.IP_INFO_KEY!);

  const geoInfo = await ipinfoWrapper.lookupIp(ip);


  pusher.trigger('EmailTracker', (req.params.timestamp).toString(), {
    "emailSentDate": new Date().toLocaleString(),
    "userAgent": req.headers['user-agent'],
    "geoInfo": {
      country: geoInfo.country,
      region: geoInfo.region,
      city: geoInfo.city,
    }
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