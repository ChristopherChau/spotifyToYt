const { config } = require('dotenv');
config();

const express = require('express');
const passport = require('passport');
const authRoutes = require('./googleAuth');

require('./google');

const app = express();
const port = 5520;

app.use(passport.initialize());

app.use('/api/auth', authRoutes);

async function bootstrap() {
  try {
    app.listen(port, () => console.log(`Running on port in the index file ${port}`));
  } catch (err) {
    console.log(err);
  }
}


bootstrap();
