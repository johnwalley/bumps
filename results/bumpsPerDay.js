var fs = require("fs");
var _ = require('lodash');

var events = JSON.parse(fs.readFileSync("generated.json"));

var mays = events.filter(e => e.set === "May Bumps").filter(e => e.gender === "Men");

var moves = mays.map(e => _.flattenDepth(e.move[0], 2));

var crews = moves.map(m => m.length);

var bumps = moves.map(m => _.sum(m.filter(x => x > 0)));

console.log(crews);
console.log(bumps);

