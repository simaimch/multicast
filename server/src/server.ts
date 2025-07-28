import express, { Request, Response } from "express";
import path from "path";
import { Server } from "socket.io";
import websocket from "./websocket/websocket";

const app = express();
const port = 8719;

const fs = require('fs');
const https = require('https');

try{
	var privateKey = fs.readFileSync('/var/www/edufant_eu_private_key.key');
	var certificate = fs.readFileSync('/var/www/edufant_eu_ssl_certificate.cer');
}catch(e){
	console.error(e.toString());
	process.exit(14);
}

var cors = require('cors');

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }))

// Parse JSON bodies (as sent by API clients)
app.use(express.json(), cors({origin:'*'}));

app.disable('x-powered-by');

// Serve index.html
app.use((req, res, next) => {
	if (req.method != 'GET' || req.path.includes('/socket.io/') || /\.(ico|js|css|jpg|png|map|ttf|svg)$/i.test(req.path)) {
		next();
	} else {
		res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
		res.header('Expires', '-1');
		res.header('Pragma', 'no-cache');
		res.sendFile(path.join(__dirname, 'public', 'index.html'));
	}
});


//Serve static assets. Needs to be second to last, just before 404.
app.use(express.static(path.join(__dirname, "public"), { immutable: true, maxAge: 604800000 /*1 week*/ }));

app.use('*', async (req: Request, res: Response, next) => {
	res.status(404).end(`"404: Service not provided: ${req.originalUrl}"`);
})

/*const webserver = app.listen(port, () => {
	console.log(`Multicast server started at port ${port}`)
})*/
const webserver = https.createServer({
	key: privateKey,
	cert: certificate
}, app).listen(port);

//#region Websocket
	var websocketServer: Server = null;
	try {
		websocketServer = 
			new Server(webserver,{cors:{
				origin: "*",
				methods: ["GET", "POST"],
			}}) ;

		
		console.log('Starting Websocket server');
		websocketServer.on('connection', websocket);
	}
	catch (e) {
		console.error('Critical Error starting up websocketServer', e.toString());
	}
	export const io = websocketServer;
//#endregion