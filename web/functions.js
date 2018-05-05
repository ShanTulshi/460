var bcrypt = require('bcryptjs'),
    cmd = require('node-cmd'),
    Q = require('q'),
    shell = require('./shellHelper.js'),
    util = require('util'),
    cp = require('child_process'),
    config = require('./config.js'); //config file contains all tokens and other private info

// MongoDB connection information
var mongodbUrl = 'mongodb://' + config.mongodbHost + ':27017/users';
var MongoClient = require('mongodb').MongoClient;

(function() {
    var childProcess = require("child_process");
    var oldSpawn = childProcess.spawn;
    function mySpawn() {
        console.log('spawn called');
        console.log(arguments);
        var result = oldSpawn.apply(this, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
})();

//used in local-signup strategy
exports.localReg = function (username, password) {
  var deferred = Q.defer();

  MongoClient.connect(mongodbUrl, function (err, database) { var db = database.db('local');
    var collection = db.collection('localUsers');

    //check if username is already assigned in our database
    collection.findOne({'username' : username})
      .then(function (result) {
        if (null != result) {
          console.log("USERNAME ALREADY EXISTS:", result.username);
          deferred.resolve(false); // username exists
        }
        else  {
          var hash = bcrypt.hashSync(password, 8);
          var user = {
            "username": username,
            "password": hash,
            "avatar": "https://api.adorable.io/avatars/100/" + username + ".png",
            "challenge": 0
          }

          console.log("CREATING USER:", username);

          collection.insert(user)
            .then(function () {
                shell.series([
                    'sudo adduser --gecos "" --shell /home/' + username + '/entry_script.sh --ingroup players --disabled-password ' + username,
                    // util.format('echo -e "%s\n%s" | sudo passwd %s', password, password, username),
                    'sudo usermod -a -G docker ' + username,
                    'sudo mkdir -u ' + username +  ' /home/' + username + '/workdir',
                    'sudo ../infra/create_entry_script.py ' + username
                ], function(err) {
                    var child = cp.spawn('passwd', [username], {
                        stdio: ['pipe', 'pipe', 'pipe']
                    });
                    child.stdin.setEncoding('utf-8');
                    child.stdin.write(password + '\n' + password + '\n');
                    child.stdout.on('data', (data) => {
                            console.log(`child stdout:\n${data}`);
                    });
                    child.stderr.on('data', (data) => {
                            console.error(`child stderr:\n${data}`);
                    });
                    child.on('close', (code) => {
                        deferred.resolve(user);
                    });
                    child.stdin.end();
                });
                /*
                cmd.get('sudo adduser --gecos "" --shell /home/' + username + '/entry_script.sh --ingroup players --disabled-password ' + username, (err, data, stderr) => {
                    console.dir(err);
                    console.dir(data);
                    cmd.get('chpasswd ' + username + ':' + password + '\n', (err, data, stderr) => {
                        console.dir(err);
                        console.dir(data);
                        cmd.get('sudo usermod -a -g docker ' + username, (err, data, stderr) => {
                            console.dir(err);
                            console.dir(data);
                            cmd.get('sudo mkdir /home/' + username + '/workdir', (err, data, stderr) => {
                                console.dir(err);
                                console.dir(data);
                                deferred.resolve(user);
                            });
                        });
                    });
                });
                **/
            });
        }
      });
  });

  return deferred.promise;
};


// check if user exists
// if user exists check if passwords match (use bcrypt.compareSync(password, hash); // true where 'hash' is password in DB)
// if password matches take into website
// if user doesn't exist or password doesn't match tell them it failed
exports.localAuth = function (username, password) {
  var deferred = Q.defer();

  MongoClient.connect(mongodbUrl, function (err, database) {
    var db = database.db('local');
    var collection = db.collection('localUsers');

    collection.findOne({'username' : username})
      .then(function (result) {
        if (null == result) {
          console.log("USERNAME NOT FOUND:", username);

          deferred.resolve(false);
        }
        else {
          var hash = result.password;

          console.log("FOUND USER: " + result.username);

          if (bcrypt.compareSync(password, hash)) {
            deferred.resolve(result);
          } else {
            console.log("AUTHENTICATION FAILED");
            deferred.resolve(false);
          }
        }
      });
  });

  return deferred.promise;
}
