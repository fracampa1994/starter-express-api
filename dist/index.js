"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import necessary modules
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const http_1 = __importDefault(require("http"));
// Create Express app and HTTP server
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Define a route for the root path
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// Define a route for tracking with timestamp
app.get('/:timestamp/track.png', (req, res) => {
    // Convert timestamp to a readable date string
    const emailSentDate = new Date(parseInt(req.params.timestamp, 10)).toLocaleString();
    // Create a log file with the timestamp in the URL
    const logFile = `${__dirname}/../logs/${req.params.timestamp}.log`;
    if (!fs_1.default.existsSync(logFile)) {
        fs_1.default.writeFileSync(logFile, '');
        fs_1.default.appendFileSync(logFile, `## Email: ${emailSentDate}\n`);
    }
    // Log the timestamp of the request
    console.log(req.params.timestamp);
    fs_1.default.appendFileSync(logFile, `${emailSentDate}\n`);
    // Log user-agent header
    console.log(req.headers['user-agent']);
    fs_1.default.appendFileSync(logFile, `${req.headers['user-agent']}\n`);
    // Log IP address
    console.log(req.ip);
    fs_1.default.appendFileSync(logFile, `${req.ip}\n`);
    // Send the track.png file in response
    res.sendFile(`${__dirname}/resources/track.png`);
});
// Start the server and listen on port 3000
server.listen(3000, () => {
    console.log('listening on *:3000');
});
