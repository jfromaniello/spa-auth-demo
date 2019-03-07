const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const debug = require('debug')('app:server');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { auth } = require('express-openid-connect');
const { join } = require('path');
const hbs = require('express-hbs');

const app = express();
const appSecret = process.env.APP_SECRET || 'keyboard cat';

// Middleware
app.use(helmet());
app.use(morgan('dev', { stream: { write: m => debug(m) } }));

app.use(
  session({ secret: appSecret, resave: false, saveUninitialized: false })
);

app.use(cookieParser(appSecret));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(join(__dirname, '../', 'public')));

hbs.registerHelper('json', obj => {
  return new hbs.SafeString(JSON.stringify(obj));
});

const userInfo = openIdUser => {
  const { email, name, nickname, picture } = openIdUser || {};
  return { email, name, nickname, picture };
};

// View engine
app.engine(
  'hbs',
  hbs.express4({
    defaultLayout: join(__dirname, '..', 'views', 'layout.hbs')
  })
);

app.set('view engine', 'hbs');
app.set('views', join(__dirname, '..', 'views'));

// Api routing
app.use('/api', auth(), require('./api'));

app.get('/*', auth({ required: false }), (req, res) => {
  res.render('index', {
    clientState: {
      user: userInfo(req.openid.user),
      isAuthenticated: req.openid.user !== undefined
    }
  });
});

app.use(auth());

module.exports = app;
