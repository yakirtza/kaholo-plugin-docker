var exec = require('child_process').exec;
var Docker = require('dockerode');
var docker = new Docker();

function build(action) {
    return new Promise((resolve,reject) => {
        let path = action.params.PATH;
        let tag = {
            t: action.params.TAG,
        };
        docker.buildImage(path, tag).then(stream=>{
            docker.modem.followProgress(stream, (err, res) => {
                if (err) return reject(err);
                let cmdOutput = "";
                res.forEach(result=>{
                    cmdOutput += result.stream;
                });
                resolve({output : cmdOutput})
            });
        });
    })
}

function pull(action) {
    return new Promise((resolve,reject) => {
        let image = action.params.IMAGE;
        let tag = action.params.TAG;
        docker.pull(image + ":" + tag).then(stream=>{
            docker.modem.followProgress(stream, (err, res) => {
            if (err) return reject(err);
            let cmdOutput = "";
            res.forEach(result=>{
                cmdOutput += result.status;
                });
            resolve({output: cmdOutput})
            })
        })
    })
}

function push(action, settings) {
    return new Promise((resolve, reject) => {
        let auth = {
            username: action.params.USER,
            password: action.params.PASSWORD || settings.PASSWORD,
        };
        let reg = action.params.REG;
        let imageTag = action.params.IMAGETAG;
        let image = docker.getImage(reg + "/" + imageTag);
        image.tag({repo: reg + "/" + imageTag}, function () {
            image.push({authconfig: auth, registry: reg + "/" + imageTag}).then(stream=>{
                docker.modem.followProgress(stream, (err, res) => {
                    if (err) return reject(err);
                    let cmdOutput = "";
                    res.forEach(result=>{
                        cmdOutput += result.status + "\r\n";
                    });
                    resolve({output: cmdOutput})
                })
            })
        })
    })
}

function tag(action) {
    return new Promise((resolve, reject) => {
        let sourceReg = action.params.SOURCEIMAGE;
        let sourceImageTag = action.params.SOURCEIMAGETAG;
        let newReg = action.params.NEWIMAGE;
        let newImageTag = action.params.NEWIMAGETAG;
        let image = docker.getImage(sourceReg + "/" + sourceImageTag);
        image.tag({repo: newReg + "/" + newImageTag}, function (err, res) {
            if (err)
            return reject(err);
            resolve(res);
        },)
    })
}

function cmdExec(action) {
    return new Promise((resolve,reject) => {
        let params = action.params.PARAMS;
        exec("docker " + params, function (err, stdout, stderr) {
            if (err || stderr)
                return reject(err);
            resolve(stdout)
        });
    })
}

module.exports = {
    build: build,
    pull: pull,
    push: push,
    tag: tag,
    cmdExec: cmdExec
};