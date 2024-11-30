import express, { } from "express";

//const express = require('express')
const app = express()
const port = 8451

var cors = require('cors');

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }))

// Parse JSON bodies (as sent by API clients)
app.use(express.json(), cors());

app.disable('x-powered-by');

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Multicast server started at port ${port}`)
})