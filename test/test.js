/* 
* @Author: caoke
* @Date:   2015-09-18 14:22:50
* @Last Modified by:   caoke
* @Last Modified time: 2015-11-08 22:31:43
*/

var updater = require('../index');
updater.npm = 'tnpm';

describe('update', function() {
    this.timeout(60000);

    it('install', function(done) {
        updater.update('http-server', done);
    });

});
