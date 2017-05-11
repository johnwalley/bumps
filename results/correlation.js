import { read_tg } from 'd3-bumps-chart';
import { joinEvents, transformData, expandCrew } from 'd3-bumps-chart';

var fs = require('fs');

const events = [];

function pickEvents(events, gender, set, yearRange = [-Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]) {
    const transformedEvents = events
        .filter(e => e.gender.toLowerCase() === gender.toLowerCase())
        .filter(e => e.set === set)
        .filter(e => e.year >= yearRange[0] && e.year <= yearRange[1])
        .sort((a, b) => a.year - b.year)
        .map(event => transformData(event));

    return joinEvents(transformedEvents, set, gender);
}

fs.readdir('./results/tg_format/', function (err, files) {
    if (err) throw err;
    var numFiles = 0;
    files.forEach(function (file) {
        const contents = fs.readFileSync('./results/tg_format/' + file, 'utf8');
        const event = read_tg(contents);
        numFiles++;
        events.push(event);
    });

    var results = pickEvents(events, 'Men', 'Lent Bumps');

    // Find crews belonging to a college
    var crews = results.crews;

    var colleges = crews.filter(function (crew) { return !/[0-9]+$/.test(crew.name); }).map(function (crew) { return crew.name; });

    var collegeBoats = colleges.map(function (college) {
        return crews.filter(function (crew) {
            return crew.name.indexOf(college) !== -1;
        })
    }).filter(function (boats) {
        return boats.length >= 2;
    });

    console.log(collegeBoats[0][0])

    var correlations = collegeBoats.map(function(boats) {
        var len = 0;
        var corr = 0;
        
        for (var i = 0; i < boats[0].values.length - 1; i++) {
            if ((boats[0].values[i].pos !== -1 && boats[1].values[i].pos !== -1)  && (boats[0].values[i+1].pos !== -1 && boats[1].values[i+1].pos !== -1)) {
                corr += (boats[0].values[i+1].pos - boats[0].values[i].pos) * (boats[1].values[i+1].pos - boats[1].values[i].pos);
                len += 1;
            }
        }

        return { name: boats[0].name, corr: corr / len };
    });

    console.log(correlations);

});

