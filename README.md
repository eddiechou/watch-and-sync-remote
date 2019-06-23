# watch-and-sync-remote
Watches a local directory and pushes any file changes to a remote copy of that directory.

## Installation
- Download or fork/clone the repository.
- Navigate to the directory.
```sh
$ npm install
```

## Configure
Copy `config.example.js` into another file named `config.js`. Replace the values for your use case.

> Make sure to use ending slashes for your paths wherever the example string uses an ending slash.

## Run
Open a new terminal and navigate to the directory to run.

```sh
$ cd /.../.../watch-and-sync-remote/
$ node index.js
```
> If the directories you are syncing are git directories, you will need to ensure both local and remote directories are on the same branch.