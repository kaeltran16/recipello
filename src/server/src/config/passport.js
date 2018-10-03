const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const keys = require('./key');

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.key;

const settingPassport = async (passport) => {
		passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
				User.findById(jwtPayload.id)
						.then(user => {
								if (user) {
										return done(null, user);
								}
								return done(null, false);
						})
						.catch(err => console.log(err));
		}));
};
