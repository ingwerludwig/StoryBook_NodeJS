const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function (passport) {
  passport.use( //dari dokumentasi passport google oauth20
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => { //untuk membuat user baru jika dibutuhkan (oleh karena itu memakai async)
        const newUser = new User ({
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value
        })

        try { //jika berhasil terhubung ke GoogleStrategy
            let user = await User.findOne({ googleId: profile.id }) //Tunggu sampai pencarian selesai

            if(user){ //jika ketemu, akhiri
                done(null, user)
            }else{ //jika tidak, buat dulu lalu akhiri
                user = await User.create(newUser)
                done(null, user)
            }
        } catch (err) { //jika gagal terhubung ke GoogleStrategy
            console.error(err)
        }
      }
    )
  )
    
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
}