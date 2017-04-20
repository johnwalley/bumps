var fs = require('fs');
var bumps = require('../src/bumps.js');

fs.readdir('./results/tg_format/', function (err, files) {
    if (err) throw err;
    var numFiles = 0;
    files.forEach(function (file) {
        const contents = fs.readFileSync('./results/tg_format/' + file, 'utf8');
        const event = bumps.write_tg(bumps.read_tg(contents));
        numFiles++;

        fs.writeFile('./results_new/' + file, event, function () {
            console.log('Scccessfully wrote file to ' + file);
        });
    });

    console.log(`Found ${numFiles} files`);
});

