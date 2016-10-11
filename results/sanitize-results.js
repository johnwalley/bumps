import { read_tg, write_tg, abbreviate } from 'd3-bumps-chart';

var fs = require('fs');

if (!fs.existsSync('./results/sanitized/')){
    fs.mkdirSync('./results/sanitized/');
}

fs.readdir('./results/tg_format/', function (err, files) {
    if (err) throw err;
    var numFiles = 0;
    files.forEach(function (file) {
        const contents = fs.readFileSync('./results/tg_format/' + file, 'utf8');
        const event = read_tg(contents);
        numFiles++;

        fs.writeFile('./results/sanitized/' + file, write_tg(abbreviate(event)), function () {
            console.log('Scccessfully sanitized ' +  file);
        });
    });

    console.log(`Found ${numFiles} files`);
});

