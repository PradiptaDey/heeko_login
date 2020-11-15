const express = require('express');

const app = express();
global.app = app;

const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

// Set all the environment variables
require('dotenv').config({ path: `${__dirname}/config/.env` });
app.set('root', __dirname);
//local modules
const PassportMiddleware = require('./passportMiddleware');
const connection = require('./dbConnection');

const migrations = require('./config/migration');
for(let [key] of Object.entries(migrations)) {
  connection.query(migrations[key], function (error) {
    if (error) throw error;
  });
}

PassportMiddleware.init(passport);

app.use(session({
  secret: 'Secret',
  rolling: true,
  resave: false,
  saveUninitialized: false
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.post('/auth/login', passport.authenticate('local', ({ failureFlash: true })),
  function(req, res) {
    return res.json({ userName: req.user.UserName });
  }
);

app.use(cookieParser());
// app.use(csrf({ cookie : true }));

require('./routes');

app.get('/logout', function(req, res){
  req.logout();
  req.session = null;
  res.clearCookie('connect.sid');
  res.clearCookie('authenticationToken');
  res.clearCookie('_csrf');
  res.send();
});

const port = parseInt(process.env.PORT) || 8080;
const ENV_CONTEXT = process.env.ENV_CONTEXT = 'Development';
/**
 * Starts the express app server
 */
function startAppServer() {
  app.enable('trust proxy');

  app.listen(port);
  console.log('Listening on port ' + port);
  console.log('Environment Context: ' + ENV_CONTEXT);
}

startAppServer();