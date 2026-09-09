import express from "express";

import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import session from 'express-session';

const { logger } = require('./Logger');
import registerApiRoutes from './api';
import registerViewRoutes from './views';

const app: express.Application = express();
const port = process.env.PORT || 8088;
// A per-process random secret keeps sessions working locally without a key in the repository; set SESSION_SECRET_KEY so sessions survive a restart.
const sessionSecretKey =
  process.env.SESSION_SECRET_KEY || crypto.randomBytes(32).toString('hex');

const tarpitEnv = {
  sessionSecretKey,
  applicationPort: process.env.PORT || 8088
};

app.set('tarpitEnv', tarpitEnv);

app.use(function(err, req, res, next) {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cookieParser());

app.use(
  session({
    secret: sessionSecretKey,
    resave: false,
    saveUninitialized: false
  })
);

app.set('view engine', 'pug');
app.set('views', `./src/Views`);

registerApiRoutes(app);
registerViewRoutes(app);

app.listen(port, () =>
  logger.log(
    `Tarpit App listening on port ${port}!. Open url: http://localhost:${port}`
  )
);
