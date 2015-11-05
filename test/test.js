/* 
* @Author: caoke
* @Date:   2015-09-18 14:22:50
* @Last Modified by:   caoke
* @Last Modified time: 2015-11-03 14:44:43
*/

var updater = require('../index');

describe('update', function() {
    this.timeout(60000);

    it('install', function(done) {
        updater.update('http-server', done);
    });

});
