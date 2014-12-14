var cluster = require('cluster');
var chalk = require('chalk');
var app = require('./app.js');

// adds a worker to do your bidding
function startWorker () {
    var worker = cluster.fork();
    console.log(
        chalk.cyan('hours-lost ')
        + 'cluster: worker %d started.', worker.id
    );
}

if (cluster.isMaster) {
    require('os').cpus().forEach(function () {
        startWorker();
    });
    // logs workers that disconnect.
    // if a worker disconnects, it exits on next exit event
    // and spawns a new worker
    cluster.on('disconnect', function (worker) {
        console.log(
            chalk.cyan('hours-lost ')
            + 'cluster: worker %d disconnected.', worker.id
        );
    });
    cluster.on('exit', function (worker, code, signal) {
        console.log(
            chalk.cyan('hours-lost ')
            + 'cluster: worker %d exited with code %d (%s).', worker.id, code, signal
        );
        startWorker();
    });
}
else {
    // starts app on worker
    app();
}