var helper
  , User = require('../db').models.User
  , _ = require('lodash');

helper = function (models, cb) {
  // Construct the $or condition
  var orCond = _(models)
    .pluck('user_id')
    .uniq()
    .map(function (u) {return {_id: u};})
    .value();

  User
    .find({$or: orCond})
    .select('firstname lastname email')
    .exec(function (err, users) {
    if(err)
      return cb(err);

    var userMap = {};

    _.each(users, function (u) {
      userMap[u._id] = {
        id: u._id
      , firstname: u.firstname
      , lastname: u.lastname
      , email: u.email
      };
    });

    cb(null, _.map(models, function (a) {
      var ret = {
        id: a._id
      , text: a.text
      , updated: a.updated
      , user: userMap[a.user_id]
      };

      if(a.c)
        ret.c = true;

      return ret;
    }));
  });
};

module.exports = helper;
