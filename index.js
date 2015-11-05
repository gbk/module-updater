/* 
* @Author: caoke
* @Date:   2015-08-20 15:55:39
* @Last Modified by:   caoke
* @Last Modified time: 2015-11-03 14:42:55
*/

'use strict';

var exec = require('child_process').exec;

exports.npm = 'npm';

exports.update = function(moduleName, callback, link) {

    // find global installed module
    runCommand([
        exports.npm,
        'list',
        '--depth=0',
        '-g',
        moduleName
    ], function(err, result) {

        if (err) {
            var type = 'install';
            console.log('>> Can not find ' + moduleName + ', try to install.');
        } else {
            var type = 'update';
            console.log('>> Found ' + moduleName + ', try to update.');
        }

        // execute install/update command
        runCommand([
            exports.npm,
            err ? 'install' : 'update',
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
    });
};

// run command async
function runCommand(command, callback, retry) {
    command = command instanceof Array ? command.join(' ') : command.toString();

    process.nextTick(function() {
        console.log('>> Running command "' + command + '"');
        exec(command, function(err, stdout, stderr) {
            if (!err && stdout) { // success
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