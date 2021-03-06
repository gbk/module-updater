/* 
* @Author: caoke
* @Date:   2015-08-20 15:55:39
* @Last Modified by:   caoke
* @Last Modified time: 2016-02-28 00:52:23
*/

'use strict';

var path = require('path');
var exec = require('child_process').exec;

exports.npm = 'npm';

exports.update = function(moduleName, callback, link) {

    if (process.platform !== 'win32') {
        // find real global node_module path
        runCommand([
            exports.npm,
            'get',
            'prefix'
        ], function(err, result) {
            grantPermission(path.join(result, 'lib', 'node_modules'), checkAndInstall);
        });
    } else {
        checkAndInstall();
    }

    // grant permission to node path
    function grantPermission(nodePath, cb) {
        console.log('>> Check node path for write permission.');
        runCommand([
            'stat',
            '-c',
            '%A',
            nodePath
        ], function(err, result) {
            if (result == 'drwxrwxrwx') {
                cb();
            } else {
                console.log('>> Grant write permission to node path.');
                runCommand([
                    'chmod',
                    '777',
                    nodePath
                ], cb, true);
            }
        });
    }

    // execute install command
    function runInstall() {
        runCommand([
            exports.npm,
            'install',
            moduleName,
            '-g'
        ], link ? function(err, result) {

            // link to local dir after global install finished
            !err && runCommand([
                exports.npm,
                'link',
                moduleName
            ], callback);

        } : callback, true);
    }

    // install a module if version is lower
    function checkAndInstall(err) {
        // find global installed module
        runCommand([
            exports.npm,
            'list',
            '--depth=0',
            '-g',
            moduleName
        ], function(err, result) {

            if (err) {
                console.log('>> Can not find ' + moduleName + ', try to install.');
                runInstall();
            } else {
                var localVersion = result.split('@').pop().split(/\s+/)[0];
                console.log('>> Found global module ' + moduleName + '@' + localVersion + '.');

                // find remote version
                runCommand([
                    exports.npm,
                    'view',
                    moduleName,
                    'version'
                ], function(err, result) {
                    if (err) {
                        callback(err, result);
                    } else {
                        console.log('>> Found remote module ' + moduleName + '@' + result + '.');

                        // local version matches remote version
                        if (result === localVersion) {
                            console.log('>> Global module version is up to date.');

                            if (link) {
                                // link to local dir after global install finished
                                runCommand([
                                    exports.npm,
                                    'link',
                                    moduleName
                                ], callback);
                            } else {
                                callback(null);
                            }
                        } else {
                            runInstall();
                        }
                    }
                });
            }
        });
    }
};

// run command async
function runCommand(command, callback, retry) {
    command = command instanceof Array ? command.join(' ') : command.toString();

    process.nextTick(function() {
        console.log('>> Running command "' + command + '"');
        exec(command, function(err, stdout, stderr) {
            if (!err) { // success
                console.log('>> Complete running command `' + command + '`.');
                callback(null, stdout.toString().replace(/(^\s+)|(\s+$)/g, ''));
            } else if (/^sudo/.test(command) || !retry) { // just failed not retry
                console.log('>> Running command `' + command + '` failed.');
                callback(err, stderr);
            } else { // retry as administrator
                console.log('>> Try running command `' + command + '` as Administrator.');
                runCommand('sudo ' + command, callback);
            }
        });
    });
}
