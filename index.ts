// Import necessary modules
import express, { Request, Response } from 'express';
import http from 'http';
import Pusher from 'pusher';
import IPinfoWrapper from "node-ipinfo";

const app = express();
const server = http.createServer(app);

app.get('/:timestamp/track.png', async (req: Request, res: Response) => {
  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: true,
  });


  const reqString = JSON.stringify(req.header);

  var ip = req.header('x-forwarded-for') || req.socket.remoteAddress!;

  const ipinfoWrapper = new IPinfoWrapper(process.env.IP_INFO_KEY!);

  const geoInfo = await ipinfoWrapper.lookupIp(ip);


  pusher.trigger('EmailTracker', 'email-read', {
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