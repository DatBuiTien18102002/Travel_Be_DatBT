const express = require("express");
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const cors = require('cors')
const cookieParser = require('cookie-parser');
const session = require("express-session");
const passport = require("passport");

const connectToMongoDb = require("./config/db.config")
const routes = require('./routes');

dotenv.config();

const app = express();
app.use(cors(
    {
        origin: process.env.URL_WEB,
        methods: "GET,POST,PUT,DELETE",
        credentials: true
    }
));

//--------------------------------
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb' }))
//--------------------------------

app.use(cookieParser())

const port = process.env.PORT || 3002

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

routes(app);

connectToMongoDb()

app.listen(port, () => {
    console.log('Server is running in port:', port);
})