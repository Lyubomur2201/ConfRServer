const passport = require('passport');
const JWTStategy = require('passport-jwt').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');
const LocalStrategy = require('passport-local').Strategy;
const { ExtractJwt } = require('passport-jwt');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const User = require('../schemas/User');

passport.use(new JWTStategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
  }, async (payload, done) => {
    try{
      
      const user = await User.findOne({username: payload.username});
      

      if(!user)
        return done(null, false);

      if(!user.isActive)
        return done(null, false);

      done(null, user);
    } catch(err) {
      done(err, false);
    };
  })
);

passport.use('google', new GooglePlusTokenStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
}, async function(accessToken, refreshToken, profile, done) {

    try {
        
      const match = await User.findOne({ 'google.id': profile.id });
      if(match) {
        if(!match.isActive)
          return done(null, false);
        return done(null, match);
      }
      else {
        const user = await User({
          _id: new mongoose.Types.ObjectId(),
          username: profile.displayName,
          name: profile.name.givenName,
          surname: profile.name.familyName,
          google: {
            id: profile.id,
            email: profile.emails[0].value
          },
          created: new Date(),
          isActive: true
        });
        user.strategy = 'google';
        await user.save();
        done(null, user);
      };
    } catch(err) {
      done(err, false);
    };
  })
);

passport.use('facebook', new FacebookTokenStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        
      const match = await User.findOne({ 'facebook.id': profile.id });
      if(match) {
        if(!match.isActive)
          return done(null, false);
        return done(null, match);
      }
      else {                    
        const user = await User({
          _id: new mongoose.Types.ObjectId(),
          username: profile.displayName,
          name: profile.name.givenName,
          surname: profile.name.familyName,
          facebook: {
            id: profile.id,
            email: profile.email
          },
          created: new Date(),
          isActive: true
        });
        user.strategy = 'facebook';
        await user.save();
        return done(null, user);
      };
    } catch(err) {                
      done(err, false);
    };
  })
);

passport.use(new LocalStrategy({
  usernameField: 'username'
}, async (username, password, done) => {
    try {
        
      const user = await User.findOne({username: username});

      if(!user)
        return done(null, false);

      if(!user.isActive)
        return done(null, false);
      
      const isEqual = await bcrypt.compare(password, user.local.password);
      
      if(!isEqual)
        return done(null, false);

      done(null, user);
    } catch(err) {
        done(err, false);
    };
  })
);