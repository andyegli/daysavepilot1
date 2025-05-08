const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../db'); // ✅ Required now

const dotenv = require('dotenv');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
  // Find or create user in the database
  const [user] = await db.query(
    'SELECT * FROM users WHERE oauth_provider = ? AND oauth_id = ?',
    ['google', profile.id]
  );
  if (user.length) {
    return done(null, user[0]);
  } else {
    const result = await db.query(
      'INSERT INTO users (oauth_provider, oauth_id, email, name) VALUES (?, ?, ?, ?)',
      ['google', profile.id, profile.emails[0].value, profile.displayName]
    );
    const newUser = {
      id: result.insertId,
      oauth_provider: 'google',
      oauth_id: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName
    };
    return done(null, newUser);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const [user] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, user[0]);
});