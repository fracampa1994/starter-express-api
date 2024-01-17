// Import necessary modules
import express, { Request, Response } from 'express';
import http from 'http';
import Pusher from 'pusher';
import IPinfoWrapper from "node-ipinfo";
import dotenv from 'dotenv';

const app = express();
const server = http.createServer(app);

const pusherAppId = process.env.PUSHER_APP_ID || '';
const pusherKey = process.env.PUSHER_KEY || '';
const pusherSecret = process.env.PUSHER_APP_SECRET;
const pusherCluster = process.env.PUSHER_APP_CLUSTER || '';

console.log(pusherAppId)
console.log(pusherKey)
console.log(pusherSecret)
console.log(pusherCluster)

console.log(process.env.IP_INFO_KEY)

app.get('/:timestamp/track.png', async (req: Request, res: Response) => {

  dotenv.config();



  const pusher = new Pusher({
    appId: pusherAppId,
    key: pusherKey,
    secret: pusherSecret!,
    cluster: pusherCluster,
    useTLS: true,
  });


  const reqString = JSON.stringify(req.header);

  var ip = req.header('x-forwarded-for') || req.socket.remoteAddress!;

  const ipinfoWrapper = new IPinfoWrapper(process.env.IP_INFO_KEY!);

  const geoInfo = await ipinfoWrapper.lookupIp(ip);

  console.log( req.params.timestamp);

  pusher.trigger('EmailTracker', 'email-read_' , {
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