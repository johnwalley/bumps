import React from 'react';
import ReactDOM from 'react-dom';
import { joinEvents, transformData, expandCrew } from 'd3-bumps-chart';

var set = 'May Bumps';

function pickEvents(events, gender, set, yearRange = [-Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]) {
  const transformedEvents = events
    .filter(e => e.gender.toLowerCase() === gender.toLowerCase())
    .filter(e => e.set === set)
    .filter(e => e.year >= yearRange[0] && e.year <= yearRange[1])
    .sort((a, b) => a.year - b.year)
    .map(event => transformData(event));

  return joinEvents(transformedEvents, set, gender);
}

function calculateCorrelation() {
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

  var correlations = collegeBoats.map(function (boats) {
    var len = 0;
    var corr = 0;

    for (var i = 0; i < boats[0].values.length - 1; i++) {
      if ((boats[0].values[i].pos !== -1 && boats[1].values[i].pos !== -1) && (boats[0].values[i + 1].pos !== -1 && boats[1].values[i + 1].pos !== -1)) {
        corr += (boats[0].values[i + 1].pos - boats[0].values[i].pos) * (boats[1].values[i + 1].pos - boats[1].values[i].pos);
        len += 1;
      }
    }

    return { name: boats[0].name, corr: corr / len };
  });
}

function diff(a) {
  var newA = [];
  for (var i = 1; i < a.length; i++)  newA.push(a[i] - a[i - 1])
  return newA;
}

function calculateHeadship(results) {
  const crews = results.crews;
  const maxDay = crews[0].values.length;
  const headCrew = crews.filter(crew => crew.values[maxDay - 1].pos === 1)[0];
  const change = diff(headCrew.values.map(v => v.pos));

  let daysHead = 0;

  for (let i = maxDay - 2; change[i] === 0 && i >= 0; i--) {
    if ((maxDay - 1 - i) % 5 === 0) {
      continue;
    }

    daysHead += 1;
  }

  return { club: expandCrew(headCrew.name, set), days: daysHead };
}

export default class Statistics extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const menResults = pickEvents(events, 'Men', set);
    const womenResults = pickEvents(events, 'Women', set);

    console.log(menResults);

    const menHeadship = calculateHeadship(menResults);
    const womenHeadship = calculateHeadship(womenResults);

    return (
      <div style={{ marginLeft: '20px' }}>
        <h1>Statistics</h1>
        <table>
          <tr>
            <th>Men</th>
            <th>Women</th>
            <th>Statistic</th>
          </tr>
          <tr>
            <td>{menHeadship.club} ({menHeadship.days})</td>
            <td>{womenHeadship.club} ({womenHeadship.days})</td>
            <td>Current Head of the River and number of days rowing over head</td>
          </tr>
          <tr>
            <td>Oriel (32)</td>
            <td>Jesus (5)</td>
            <td>Total number of Headships</td>
          </tr>
          <tr>
            <td>Oriel (37)</td>
            <td>Christ Church (15)</td>
            <td>Total number of years in Division 1</td>
          </tr>
        </table>
      </div>
    )
  }
}

