require('dotenv').config()
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const authRoutes = require('./config/youtubeAuthConfig/googleAuth')
const ytAuth = require('./config/youtubeAuthConfig/youtubeToken')
const routes = require('./routes/routes')
const port = process.env.PORT || 5501
const app = express()

async function afterServerStart() {
  console.log('Server is up and running.')
}

async function bootstrap(callback) {
  app.use(
    session({
      secret: `${ytAuth.youtubeGetToken()}`, // Replace with your own secret key
      resave: false,
      saveUninitialized: true,
    }),
  )

  app.use(passport.initialize())
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) =>
    // eslint-disable-next-line no-undef
    User.findById(id, (err, user) => done(err, user)),
  )

  app.use('/api/auth', authRoutes)
  app.use('/', routes) // Use the routes

  try {
    app.listen(port, callback)
  } catch (err) {
    console.log(err)
  }
}

bootstrap(afterServerStart)
