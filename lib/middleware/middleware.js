'use strict';
var cluster = require('cluster');
var chalk = require('chalk');
var middleware = {
    // logs which worker that's handling requests
    clusterlog: function (req, res, next) {
        if (cluster.isWorker) {
            console.log(
                chalk.cyan('hours-lost ')
                + 'clusterlog: worker %d handling request.', cluster.worker.id
            );
            next();
        }
    }
};

// export all middleware
module.exports = middleware;