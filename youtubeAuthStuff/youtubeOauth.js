const express = require('express');
const authRoutes = require('./googleAuth');
const passport = require('passport');
const { config } = require('dotenv');

require('./google');

const GOOGLE_ID = '36943627344-9nvmr1ssaln2b61evcgjrujgstd81vav.apps.googleusercontent.com';
const GOOGLE_SECRET = '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';

const port = process.env.port || 5502;
const app = express();


async function bootstrap(){
  app.use(passport.initialize());
  app.use('/api/auth', authRoutes);

  try{
    app.listen(port, () => console.log(`Running on port: ${port}`));
  }
  catch(err){
    console.log(err)
  }

}

bootstrap();