var fs = require('fs');
var bumps = require('../src/bumps.js');

const events = [];

fs.readdir('./results/tg_format/', function (err, files) {
    if (err) throw err;
    var numFiles = 0;
    files.forEach(function (file) {
        const contents = fs.readFileSync('./results/tg_format/' + file, 'utf8');
        const event = bumps.read_tg(contents);
        numFiles++;
        events.push(event);
    });

    fs.writeFile('./results/generated.json', JSON.stringify(events), function() {
        console.log('Scccessfully wrote file to ./generated.json');
    });

    console.log(`Found ${numFiles} files`);
});

