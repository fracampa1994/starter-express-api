"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailData = void 0;
// Import necessary modules
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const pusher_1 = __importDefault(require("pusher"));
const node_ipinfo_1 = __importDefault(require("node-ipinfo"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const pusherAppId = process.env.PUSHER_APP_ID || '';
const pusherKey = process.env.PUSHER_KEY || '';
const pusherSecret = process.env.PUSHER_APP_SECRET;
const pusherCluster = process.env.PUSHER_APP_CLUSTER || '';
console.log(pusherAppId);
console.log(pusherKey);
console.log(pusherSecret);
console.log(pusherCluster);
console.log(process.env.IP_INFO_KEY);
app.get('/:timestamp/track.png', async (req, res) => {
    dotenv_1.default.config();
    const pusher = new pusher_1.default({
        appId: pusherAppId,
        key: pusherKey,
        secret: pusherSecret,
        cluster: pusherCluster,
        useTLS: true,
    });
    const reqString = JSON.stringify(req.header);
    var ip = req.header('x-forwarded-for') || req.socket.remoteAddress;
    const ipinfoWrapper = new node_ipinfo_1.default(process.env.IP_INFO_KEY);
    const geoInfo = await ipinfoWrapper.lookupIp(ip);
    console.log(req.params.timestamp);
    pusher.trigger('EmailTracker', 'email-read_', {
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
class EmailData {
    constructor(emailSentDate, userAgent, ipAddr) {
        this.emailSentDate = emailSentDate;
        this.userAgent = userAgent;
        this.ipAddr = ipAddr;
    }
}
exports.EmailData = EmailData;
