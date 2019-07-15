const watch = require("node-watch");
const client = require("scp2");
const node_ssh = require("node-ssh");
const config = require("./config");
const fs = require("fs");
const ssh = new node_ssh();

const scpDefaultConfig = {
  port: config.remotePort,
  host: config.remoteHost,
  username: config.remoteUsername,
  privateKey: fs.readFileSync(config.privateKeyPath),
  // password: 'password', (accepts password also)
  path: config.remotePath
};

// For file removals
ssh.connect({
  host: config.remoteHost,
  username: config.remoteUsername,
  privateKey: config.privateKeyPath
});

watch(config.watchDirectoryPath, { recursive: true }, (evt, absolutePath) => {
  // Ignore all git files
  if (absolutePath.includes(".git")) {
    return;
  }
  console.log(`${evt}: ${absolutePath}`);

  let scpCustomConfig = { ...scpDefaultConfig };
  let relativePath = absolutePath.replace(config.watchDirectoryPath, "");
  scpCustomConfig["path"] = scpDefaultConfig["path"] + relativePath;

  if (evt === "update") {
    client.scp(absolutePath, scpCustomConfig, function(err) {
      if (err) {
        console.log(`error: ${err}`);
      }
    });
  } else if (evt === "remove") {
    ssh
      .execCommand(`ls -pd ${relativePath}`, {
        cwd: `${config.remotePath}`
      })
      .then(function(result) {
        if (result.stdout) {
          console.log("STDOUT: " + result.stdout);
          let removeCommand = "rm -f";

          // command for directory
          if (result.stdout[result.stdout.length - 1] === "/") {
            removeCommand = "rm -rf";
          }

          ssh
            .execCommand(`${removeCommand} ${relativePath}`, {
              cwd: `${config.remotePath}`
            })
            .then(function(result) {
              if (result.stdout) {
                console.log("STDOUT: " + result.stdout);
              }
              if (result.stderr) {
                console.log("STDERR: " + result.stderr);
              }
            });
        }
        if (result.stderr) {
          console.log("STDERR: " + result.stderr);
        }
      });
  }
});

console.log(
  `watch-and-sync-remote is now watching directory: ${
    config.watchDirectoryPath
  }`
);
