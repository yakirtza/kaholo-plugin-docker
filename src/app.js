var exec = require('child_process').exec;
var Docker = require('dockerode');
var nodePath = require('path');
var docker = new Docker();

function _getUrl(url, image, tag){
    return `${url ? `${url}/` : ''}${image}:${tag}`
}

function _getAuth(action, settings){
    return {
        username: action.params.USER || settings.USER,
        password: action.params.PASSWORD || settings.PASSWORD
    }
}

function _streamFollow(stream) {
    return new Promise((resolve,reject)=>{
        docker.modem.followProgress(stream, (err, res) => {
            if (err) return reject(err);
            let cmdOutput = "";
            res.forEach(result=>{
                cmdOutput += result.status;
            });
            resolve({output: cmdOutput})
        })
    })
}

function build(action) {
    let path = action.params.PATH;
    let options = {};
    if (action.params.TAG)
        options.t = action.params.TAG;  
    
    let parsedPath = nodePath.parse(path);

    return docker.buildImage({
        context : parsedPath.dir,
        src : [parsedPath.name]
    }, options).then(stream=>{
        return _streamFollow(stream);
    });
}

function pull(action, settings) {
    let auth = _getAuth(action,settings);
    let imageUrl = _getUrl(action.params.URL, action.params.IMAGE, action.params.TAG)
    
    return docker.pull(imageUrl, {authconfig: auth}).then(stream=>{
        return _streamFollow(stream);
    })
}

function push(action, settings) {
    let imageTag = action.params.IMAGETAG;
    let imageRepo = action.params.IMAGE;
    
    let auth = _getAuth(action,settings);
    let imageUrl = _getUrl(action.params.URL, imageRepo, imageTag);
    let image = docker.getImage(imageRepo + ":" + imageTag);

    image.tag({repo: imageUrl});
    var imageToPush = docker.getImage(imageUrl);
    
    return imageToPush.push({authconfig: auth, registry: imageUrl}).then(stream=>{
        return _streamFollow(stream);
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
        })
    })
}

function cmdExec(action) {
    return new Promise((resolve,reject) => {
        let params = action.params.PARAMS;
        exec("docker " + params, function (err, stdout, stderr) {
            if (err || stderr)
                return reject(err || stderr);
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