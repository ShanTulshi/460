var util = require('util');
var cp = require('child_process');
console.log(util.format('echo -e "%s\n%s" | sudo passwd %s', 'password', 'password', 'username'));
                    var child = cp.spawn('chpasswd', [], {
                        stdio: ['pipe', 'pipe', 'pipe']
                    });
                    child.stdin.write('username' + ':' + 'password');
                    child.stdout.on('data', (data) => {
                            console.log(`child stdout:\n${data}`);
                    });
                    child.stderr.on('data', (data) => {
                            console.error(`child stderr:\n${data}`);
                    });
                    child.stdin.end();
