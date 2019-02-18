let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let mongoose = require('mongoose');
let User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'user[email]',
    passwordField: 'user[password]'
}, (email, password, done) => {
    User.findOne({email: email}).then((user) => {
        if (!user || !user.validPassword(password)) {
            return done(nulll, dalse, {errors: {'email or password': 'is invalid'}});
        }

        return done(null, user);
    }).catch(done);
}));