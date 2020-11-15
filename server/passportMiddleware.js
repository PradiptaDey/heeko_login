const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const connection = require('./dbConnection');

class PassportMiddleware {
  static init(passport) {
    passport.use(new LocalStrategy({
      usernameField: 'Username',
      passwordField: 'Password'
    },
      function (username, password, done) {
        connection.query(`select * from Users where UserName = '${username}'`, function (err, users) {
          if (err) {
            return done(err);
          }
          if (!users[0]) {
            return done(null, false, { messege: 'No User Found' });
          }
          bcrypt.compare(password, users[0].hash, (err, validatePw) => {
            if (!validatePw) {
              return done(null, false, { messege: 'Incorrect username or password' });
            }
            return done(null, Object.assign({}, { UserId: users[0].UserId, UserName: users[0].UserName }));
          });
        });
      }
    ));

    passport.serializeUser((user, done) => {
      done(null, user.UserId);
    });

    passport.deserializeUser((userId, done) => {
      connection.query(`select * from Users where UserId = '${userId}'`, function(err, users) {
        if(err) {
          return done(err);
        }
        return done(null, Object.assign({}, { UserId: users[0].UserId, UserName: users[0].UserName }));
      });
    });
  }
}

module.exports = PassportMiddleware;
