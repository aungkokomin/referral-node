const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const { findUserByEmail, createUser, findUserById } = require('../user/user.service'); // Assumed service functions for user operations

// Local login strategy
passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        const user = await findUserByEmail(email);
        if (!user || !await user.validatePassword(password)) {
            return done(null, false, { message: 'Invalid credentials' });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// // Google OAuth strategy
// passport.use('google', new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: '/auth/google/callback'
// }, async (accessToken, refreshToken, profile, done) => {
//     try {
//         let user = await findUserByEmail(profile.emails[0].value);
//         if (!user) {
//             user = await createUser({
//                 email: profile.emails[0].value,
//                 name: profile.displayName,
//                 googleId: profile.id
//             });
//         }
//         return done(null, user);
//     } catch (error) {
//         return done(error);
//     }
// }));

// // GitHub OAuth strategy
// passport.use('github', new GitHubStrategy({
//     clientID: process.env.GITHUB_CLIENT_ID,
//     clientSecret: process.env.GITHUB_CLIENT_SECRET,
//     callbackURL: '/auth/github/callback'
// }, async (accessToken, refreshToken, profile, done) => {
//     try {
//         let user = await findUserByEmail(profile.emails[0].value);
//         if (!user) {
//             user = await createUser({
//                 email: profile.emails[0].value,
//                 name: profile.displayName,
//                 githubId: profile.id
//             });
//         }
//         return done(null, user);
//     } catch (error) {
//         return done(error);
//     }
// }));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await findUserById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = { passport };