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
// Create Express app and HTTP server
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Define a route for the root path
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// Define a route for tracking with timestamp 
app.get('/:timestamp/track.png', (req, res) => {
    const pusher = new pusher_1.default({
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
        "ipAddr": req.socket.remoteAddress
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
