require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../db');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE oauth_provider = ? AND oauth_id = ?',
      ['google', profile.id]
    );

    if (rows.length > 0) {
      console.log('User found in DB:', rows[0]);
      return done(null, rows[0]);
    } else {
      const [result] = await db.query(
        'INSERT INTO users (oauth_provider, oauth_id, email, name) VALUES (?, ?, ?, ?)',
        ['google', profile.id, profile.emails[0].value, profile.displayName]
      );

      const [newRows] = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
      console.log('New user inserted:', newRows[0]);
      return done(null, newRows[0]);
    }
  } catch (err) {
    console.error('Passport strategy error:', err);
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  console.log('Serializing user:', user);
  if (!user.id) {
    console.error('serializeUser failed: user.id is undefined');
    return done(new Error('User ID is missing'));
  }
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      console.error('deserializeUser failed: no user found for ID', id);
      return done(new Error('User not found'));
    }
    done(null, rows[0]);
  } catch (err) {
    console.error('deserializeUser error:', err);
    done(err);
  }
});
