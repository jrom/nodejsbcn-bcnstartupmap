var nano = require('nano')('http://localhost:5984')
  , db = nano.db.use('startups')
  , crypto = require('crypto')
  , async = require('async');

hash = function (pass, salt) {
  var h = crypto.createHash('sha512');
  h.update(pass);
  h.update(salt);
  return h.digest('base64');
};

exports.index = function(req, res) {
  res.render('index');
};

exports.new = function(req, res) {
  res.render('startups/create');
};

exports.locations = function(req, res) {
  db.view('startups', 'index', function(error, result) {
    var startups = [];
    async.forEach(result.rows, function(row, callback) {
      var startup = {
        "geometry": { "type": "Point" },
        "properties": { 
          'marker-color': '#000',
          'marker-symbol': 'star-stroked',
        }
      };
      startup.geometry.coordinates = [row.value.location[1], row.value.location[0]];
      startup.properties.title = row.value.name;
      startup.properties.address = row.value.address;
      startup.properties.description = row.value.description;
      startups.push(startup);
      callback(null, startups)
    }, function(error) {
      if(!error) {
        res.send(500)
        //res.json(startups);
      } else {
        res.json([]);
      }
    });
  });
}
exports.create = function(req, res) {
  var doc = {
    jsonType: "startup"
  };
  doc.name = req.body.startupname;
  doc.address = req.body.address;
  doc.location = [parseFloat(req.body.lat), parseFloat(req.body.lon)];
  doc.description = req.body.description;
  db.insert(doc, function(error, result) {
    if(!error) {
      res.render('startups/show', {startup: doc});
    } else {
      console.log(error, result);
    }
  });
}
exports.login = function(req, res) {
  res.render('login');
}

exports.findByUsername = function(username, callback) {
  db.get('user:'+username, function(error, result) {
    callback(null, result);
  });
}

exports.signup = function(req, res) {
  res.render('signup');
}

exports.deleteUser = function(req, res) {
  db.head('user:'+req.params.id, function(error, body, head) {
    db.destroy('user:'+req.params.id, head.etag.substring(1, head.etag.length-1), function(error, result) {
      if(!error) {
        res.send(200)
      } else {
        res.send(500)
      }
    });
  })
}

exports.register = function(req, res) {
  var user = {
    jsonType: 'user',
    username: req.body.username,
    password: hash(req.body.password, req.body.username),
    created_at: new Date(),
    updated_at: new Date()
  };
  db.insert(user, 'user:'+user.username, function(error, result) {
    if(!error) {
      req.logIn(user, function(error) {
        res.redirect('/');
      });
    } else {
      res.send(error.status_code)
    }
  });
}
