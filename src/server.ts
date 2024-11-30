import express, { } from "express";

//const express = require('express')
const app = express()
const port = 8451

var cors = require('cors');

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json(), cors());

app.disable('x-powered-by');