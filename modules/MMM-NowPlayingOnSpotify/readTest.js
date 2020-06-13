var fs = require('fs');

let rawdata = fs.readFileSync('authorization/spotifyConfig.json');
let config = JSON.parse(rawdata);

console.log(config);
