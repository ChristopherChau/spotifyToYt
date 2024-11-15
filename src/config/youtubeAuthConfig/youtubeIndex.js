const express = require('express')
const session = require('express-session')
const authRoutes = require('./googleAuth')
const passport = require('passport')
const ytAuth = require('./youtubeToken')

require('./youtubeConfig')

const port = process.env.port || 5501
const app = express()

async function afterServerStart() {
  console.log('Server is up and running.')
}

async function bootstrap(callback) {
  app.use(
    session({
      secret: `${ytAuth.youtubeGetToken()}`,
      resave: false,
      saveUninitialized: true,
    }),
  )
  // Initialize middleware that will allow us to handle authentication
  app.use(passport.initialize())

  // This will specify the routes that we can take and what to do when we go to these routes
  app.use('/api/auth', authRoutes)

  try {
    app.listen(port)
    callback() // Call the callback after server startup
  } catch (err) {
    console.log(err)
  }
}

// Call bootstrap with the afterServerStart callback
bootstrap(afterServerStart)
