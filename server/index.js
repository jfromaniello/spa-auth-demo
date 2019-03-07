const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const debug = require('debug')('app:server');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { join } = require('path');

const app = express();
const appSecret = process.env.APP_SECRET || 'keyboard cat';

app.use(helmet());
app.use(morgan('dev', { stream: { write: m => debug(m) } }));
app.use(session({ secret: appSecret }));
app.use(cookieParser(appSecret));
app.use(bodyParser.json());
app.use(express.static(join(__dirname, '../', 'public')));

module.exports = app;
