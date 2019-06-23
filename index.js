const watch = require('node-watch');
const client = require('scp2');
const config = require('./config');

const scpDefaultConfig = {
    port: config.remotePort,
    host: config.remoteHost,
    username: config.remoteUsername,
    privateKey: require("fs").readFileSync(config.privateKeyPath),
    // password: 'password', (accepts password also)
    path: config.remotePath,
};

watch(config.watchDirectoryPath, { recursive: true }, (evt, absolutePath) => {
    console.log('%s changed.', absolutePath);
    
    let scpCustomConfig = {...scpDefaultConfig};
    let relativePath = absolutePath.replace(config.watchDirectoryPath, '');
    scpCustomConfig["path"] = scpDefaultConfig["path"] + relativePath;
    
    client.scp(absolutePath, scpCustomConfig, function(err) {
        console.log(err);
    }); 
});

console.log(`watch-and-sync-remote is now watching directory: ${config.watchDirectoryPath}`);