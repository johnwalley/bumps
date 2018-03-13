const { read_ad } = require('d3-bumps-chart');

const fs = require('fs');

const events = [];

fs.readdir('./results/ad_format/', function(err, files) {
  if (err) throw err;
  let numFiles = 0;
  files.forEach(function(file) {
    const contents = fs.readFileSync('./results/ad_format/' + file, 'utf8');
    const event = read_ad(contents);
    numFiles++;
    events.push(event);
  });

  fs.writeFile('./results/generated.json', JSON.stringify(events), function() {
    console.log('Scccessfully wrote file to ./generated.json');
  });

  console.log(`Found ${numFiles} files`);
});
