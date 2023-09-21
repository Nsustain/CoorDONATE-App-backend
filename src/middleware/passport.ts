import passport from 'passport';
import {Strategy as GoogleStrategy, Profile, VerifyCallback} from 'passport-google-oauth20';

passport.serializeUser<any, any>((_req, user, done) => {
    done(null, user);
  });

passport.deserializeUser<any, any>((user, done) => {
    done(null, user);
  });


passport.use(new GoogleStrategy({
    clientID: process.env.GoogleClientId!,
    clientSecret: process.env.GoogleClientSecret!,
    callbackURL: process.env.GoogleCallbackURL,
    passReqToCallback: true,
}, (request, accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback)=> {
    done(null, profile)
}));

