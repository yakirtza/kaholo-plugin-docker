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


const functions = {
    EXECUTE: executeCMD,
    EXECUTE_MULTIPLE_COMMANDS: executeMultiple
};

function main(argv) {
    if (argv.length < 3) {
        console.log('{err: "not enough parameters"}');
        // Invalid Argument
        // Either an unknown option was specified, or an option requiring a value was provided without a value.
        process.exit(9);
    }
    let action = JSON.parse(argv[2]);
    functions[action.method.name](action).then(function (res) {
        console.log(res);
        process.exit(0); // Success
    }, function (err) {
        console.log("an error occured", err);
        // Uncaught Fatal Exception
        // There was an uncaught exception, and it was not handled by a domain or an 'uncaughtException' event handler.
        process.exit(1); // Failure
    });
}

main(process.argv);