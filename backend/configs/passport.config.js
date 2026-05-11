const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = require('../config/config');
const User = require('../models/User');
const Role = require('../models/Role');

/**
 * Google OAuth 2.0 Strategy.
 * Only initialized if GOOGLE_CLIENT_ID is provided to prevent crashes.
 */
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID:     GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL:  GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email'],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email returned from Google'), null);
          }

          let user = await User.findOne({ $or: [{ googleId: profile.id }, { email }] }).populate('role');

          if (user) {
            if (!user.googleId) {
              user.googleId = profile.id;
              user.emailVerified = true;
              await user.save();
            }
            return done(null, user);
          }

          let defaultRole = await Role.findOne({ name: 'Employee' });
          if (!defaultRole) {
            defaultRole = await Role.create({
              name: 'Employee',
              permissions: [],
              description: 'Default employee role',
              isCustom: false,
            });
          }

          user = await User.create({
            googleId:      profile.id,
            name:          profile.displayName || email.split('@')[0],
            email,
            emailVerified: true,
            role:          defaultRole._id,
          });

          const populated = await User.findById(user._id).populate('role');
          return done(null, populated);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
} else {
  console.log('⚠️ Google OAuth credentials missing. Google login will be disabled.');
}

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).populate('role');
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
