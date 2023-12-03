const express = require("express");
const path = require("path");
const http = require("http");
const cors = require("cors");
const { config } = require("./config/secret.js");
const { routesInit } = require("./routes/config_routes.js")
require("./db/mongoConnect.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")))

routesInit(app);

const server = http.createServer(app);

let port = process.env.PORT || config.port;
server.listen(port);