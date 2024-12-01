import express, { Request, Response } from "express";
import path from "path";

const app = express();
const port = 8719;

var cors = require('cors');

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }))

// Parse JSON bodies (as sent by API clients)
app.use(express.json(), cors());

app.disable('x-powered-by');

// Serve Up index.html
app.use((req, res, next) => {
    if (req.method != 'GET' || req.path.includes('/socket.io/') || /\.(ico|js|css|jpg|png|map|ttf)$/i.test(req.path)) {
        next();
    } else {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

app.use('*', async (req: Request, res: Response, next) => {
    res.status(404).end(`"404: Service not provided: ${req.originalUrl}"`);
})

const webserver = app.listen(port, () => {
    console.log(`Multicast server started at port ${port}`)
})