const exec = require('child_process').exec;
const q = require('q');
const async = require('async');


function executeCMD(action) {
    let deferred = q.defer();
    let execString = action.method.actionString;
    for (let i = 0; i < action.method.params.length; i++) {
        let param = action.method.params[i].name;
        if (action.params.hasOwnProperty(param)) {
            execString = execString.replace(param, action.params[param]);
        }
        else {
            execString = execString.replace(param, '');
        }
    }
    exec(execString,
        function (error, stdout, stderr) {
            if (error) {
                return deferred.reject(stderr);
            }
            return deferred.resolve(stdout);
        }
    );
    return deferred.promise;
}

function executeMultiple(action) {
    let deferred = q.defer();

    let commands = action.params.COMMANDS.split('\n');
    console.log(commands);
    let results = [];
    async.each(commands, function(command, cb) {
        exec(command,
            function (error, stdout, stderr) {
                if (error) {
                    return cb(error + stderr);
                }
                return results.push(stdout);
            })
    }, function (error) {
        if (error) {
            return deferred.reject(error);
        }
        let resString;

        results.forEach((result) => {
            resString = resString + result + '\n';
        });
        return deferred.resolve()
    });

    return deferred.promise;

}


module.exports = {
    EXECUTE: executeCMD,
    EXECUTE_MULTIPLE_COMMANDS: executeMultiple
};