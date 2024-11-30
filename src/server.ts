import express, { Request, Response } from "express";

//const express = require('express')
const app = express()
const port = 8719

var cors = require('cors');

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }))

// Parse JSON bodies (as sent by API clients)
app.use(express.json(), cors());

app.disable('x-powered-by');

app.use('*', async (req: Request, res: Response, next) => {
    res.status(404).end(`"404: Service not provided: ${req.originalUrl}"`);
})

const webserver = app.listen(port, () => {
    console.log(`Multicast server started at port ${port}`)
})