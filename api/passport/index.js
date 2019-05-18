const passport = require('passport');
const JWTStategy = require('passport-jwt').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');
const LocalStrategy = require('passport-local').Strategy;
const { ExtractJwt } = require('passport-jwt');
const bcrypt = require('bcrypt');

const User = require('../database/models/User');

passport.use(new JWTStategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
  }, async (payload, done) => {
    try{
      const user = await User.findOne({
        where: {username: payload.username},
        include: 'Topics'
      });
      
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
      const match = await User.findOne({
        where: { 'google': profile.id }
      });
      
      if(match) {
        if(!match.isActive)
          return done(null, false);
        return done(null, match);
      }
      else {
        const user = await User.create({
          username: profile.displayName,
          google:  profile.id,
          email: profile.emails[0].value,
          isActive: true
        });
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
      const match = await User.findOne({
        where: { 'facebook': profile.id }
      });
      if(match) {
        if(!match.isActive)
          return done(null, false);
        return done(null, match);
      }
      else {                    
        const user = await User.create({
          username: profile.displayName,
          facebook: profile.id,
          email: profile.email,
          isActive: true
        });
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
      const user = await User.findOne({
        where: {username: username}
      });

      if(!user)
        return done(null, false);

      if(!user.isActive)
        return done(null, false);
      
      const isEqual = await bcrypt.compare(password, user.password);
      
      if(!isEqual)
        return done(null, false);

      done(null, user);
    } catch(err) {
        done(err, false);
    };
  })
);