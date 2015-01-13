'use strict';
// own deps
var chalk = require('chalk');
var User = require('../../models/User.js');
module.exports = function (app, socket, passport, session) {
  var storeUser = function (user) {
    console.log('user');
    console.log(user);
    //var index = accountArray.length - 1;
    //// if user are stored already, push to same, else, push new
    //accountArray.length > 0 ?
    //  accountArray[0].socialmediaData[socialmedia] = user.socialmediaData[socialmedia]:
    //  accountArray.push(user);
    //userCallback({user: 'anton'});
    //console.log(chalk.green('\nstored user ' + user.toString()));
    //console.log(chalk.cyan(accountArray));
  };
  // serialize the user into session
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  // deserialize the user out of session
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
  require('./TwitterAuth.js')(socket, session, passport, storeUser);
  require('./FacebookAuth.js')(socket, session, passport, storeUser);
  //require('./GooglePlusAuth.js')(app, socket, sessionStore, sid, passport, storeUser);
  //require('./InstagramAuth.js')(app, socket, sessionStore, sid, passport, storeUser);
};
