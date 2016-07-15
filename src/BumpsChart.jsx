import React from 'react';
import * as d3 from 'd3';

const bumps = require('./bumps.js');

function crewColor(name) {
  const collegeColor = {
    'A': '#0000ff',
    'AR': '#ffff00',
    'Ca': '#afe9c6',
    'CC': '#800000',
    'CH': '#ffff00',
    'Cl': '#ffff00',
    'Cr': '#000080',
    'CT': '##ffff00',
    'Cu': '#ff55dd',
    'D': '#d400aa',
    'Dw': '#000080',
    'E': '#eeaaff',
    'F': '#808080',
    'G': '#005500',
    'H': '#000000',
    'HH': '#0096ff',
    'HHL': '#0044aa',
    'J': '#8b0000',
    'K': '#5a2ca0',
    'L': '#ff0000',
    'LC': '#0044aa',
    'M': '#672178',
    'ME': '#000000',
    'N': '#010040',
    'NH': '#000000',
    'Pb': '#afe9dd',
    'Ph': '#003380',
    'Q': '#008001',
    'QM': '#808080',
    'R': '#007fff',
    'S': '#f9cc00',
    'SC': '#9d0064',
    'SE': '#0300fd',
    'SS': '#000080',
    'T': '#000080',
    'TC': '#000000',
    'TH': '#000000',
    'VS': '#000000',
    'W': '#5599ff',
  };

  const townColor = {
    'City': '#f44336',
    'Champs': '#f57400',
    'Rob Roy': '#8b0000',
    'Cantabs': '#00008b',
    '99': '#5197ff'
  };

  const sh = name.replace(/[0-9]/, '');

  if (collegeColor.hasOwnProperty(sh)) {
    return collegeColor[sh];
  }

  const club = name.substring(0, name.length - 2).trim();

  if (townColor.hasOwnProperty(club)) {
    return townColor[club];
  }

  return '#f44336';
}

export default class BumpsChart extends React.Component {
  componentDidMount() {
    this.setup.call(this);
    this.update.call(this);
  }

  componentDidUpdate() {
    this.update.call(this);
  }

  setup() {
    this.svg = d3.select('.bumpsChart').select('svg');

    this.svg.append('clipPath').attr('id', 'clip').append('rect')
      .attr('width', 80)
      .attr('height', 800);
    this.svg.append('g').attr('class', 'divisions').attr('clip-path', 'url(#clip)');
    this.svg.append('g').attr('class', 'years').attr('clip-path', 'url(#clip)');
    this.svg.append('g').attr('class', 'labels');
    this.svg.append('g').attr('class', 'lines').attr('clip-path', 'url(#clip)');
  }

  update() {
    const data = this.props.data;
    const year = this.props.year;
    const selectedCrews = this.props.selectedCrews;
    const addSelectedCrew = this.props.addSelectedCrew;
    const removeSelectedCrew = this.props.removeSelectedCrew;

    // Do we have any data to show?
    if (data === undefined || year === null) {
      return;
    }

    const svg = this.svg;
    const crews = data.crews;
    const widthOfOneYear = 80;
    const heightOfOneCrew = 20;
    const widthWithoutLines = 310;
    const initialViewBoxX = -165;
    const initialViewBoxY = 0;
    const transitionLength = 500;
    const startLabelPosition = 0;
    const finishLabelPosition = 4;
    const numbersLeftPosition = -8;
    const numbersRightPosition = 7;
    const xRangeMax = widthOfOneYear;
    const numYearsToView = year.end - year.start + 1;
    const yMarginTop = 10;
    
    crews.forEach(crew => crew.highlighted = (selectedCrews.has(crew.name) ? true : false));

    const x = d3.scaleLinear();
    const y = d3.scaleLinear();

    x.domain([0, 4]);
    x.range([0, xRangeMax]);

    const yDomainMax = d3.max(crews, c => d3.max(c.values.filter(d => d !== null), v => v.pos));

    y.domain([-1, yDomainMax]);
    y.range([yMarginTop, yDomainMax * heightOfOneCrew - yMarginTop]);

    const viewBoxWidth = (widthWithoutLines + widthOfOneYear * 5 / 4 * numYearsToView);
    const viewBoxHeight = yDomainMax * heightOfOneCrew;

    svg.attr('height', viewBoxHeight / viewBoxWidth * window.innerWidth)
      .attr('viewBox', `${initialViewBoxX}, ${initialViewBoxY}, ${viewBoxWidth}, ${viewBoxHeight}`);

    const divisionsGroup = svg.select('.divisions');
    const yearsGroup = svg.select('.years');
    const labelsGroup = svg.select('.labels');
    const lines = svg.select('.lines');

    const line = d3.line()
            .defined(d => d !== null && d.pos > -1)
            .x((d) => x(d.day))
            .y((d) => y(d.pos));

    const startYear = data.startYear;
    const endYear = data.endYear;

    const yearRelative = year.start - startYear;

    const dayShift = yearRelative * 5;
    const startLabelIndex = yearRelative * 5;
    let finishLabelIndex = startLabelIndex + numYearsToView * 5 - 1;

    const maxDays = d3.max(data.crews.map(c => c.values.length));

    if (finishLabelIndex > maxDays - 1) {
      finishLabelIndex = maxDays - 1;
    }

    // ClipPath
    const clipPath = svg.select('clipPath').select('rect')
            .datum(numYearsToView);

    clipPath.transition()
            .duration(transitionLength)
            .attr('width', w => x(5 * w - 1))
            .attr('height', viewBoxHeight);

    // Divisions
    const divisions = divisionsGroup.selectAll('.divisionYear')
            .data(data.divisions, (d, i) => d.gender + d.set.replace(/ /g, '') + i);

    const divisionsEnter = divisions.enter()
            .append('g')
            .attr('class', 'divisionYear')
            .attr('id', d => d.year)
            .attr('transform', `translate(${x(-dayShift)},0)`);

    divisions.transition()
            .duration(transitionLength)
            .attr('transform', `translate(${x(-dayShift)},0)`);

    divisions.exit()
            .remove();

    // DivisionsYear
    const divisionsYear = divisionsEnter.selectAll('rect.division')
            .data(d => d.divisions, d => d.start);

    divisionsYear.enter()
            .append('rect')
            .attr('class', 'division')
            .attr('id', d => d.start)
            .style('stroke', 'black')
            .style('fill', (d, i) => (i % 2 ? '#E0E0E0' : '#FFFFFF'))
            .attr('x', d => x(d.year - startYear) * 5)
            .attr('y', d => y(d.start - 0.5))
            .attr('width', x(4) - x(0))
            .attr('height', d => y(d.start + d.length) - y(d.start))
            .style('opacity', 1e-6)
            .transition()
            .duration(transitionLength)
            .style('opacity', 1);

    divisionsYear
            .transition()
            .duration(transitionLength)
            .attr('x', d => x(d.year - startYear) * 5)
            .attr('y', d => y(d.start - 0.5))
            .attr('width', x(4) - x(0))
            .attr('height', d => y(d.start + d.length) - y(d.start));

    divisionsYear.exit()
            .transition()
            .duration(transitionLength)
            .style('opacity', 1e-6)
            .remove();

    // Years
    const years = yearsGroup.selectAll('.year')
            .data(d3.range(startYear, endYear + 1), d => d);

    years.enter()
            .append('text')
            .attr('class', 'year')
            .attr('x', d => x((d - startYear) * 5 + 2))
            .attr('y', y(0))
            .attr('text-anchor', 'middle')
            .attr('transform', `translate(${x(-dayShift)},0)`)
            .text(d => d);

    years.transition()
            .duration(transitionLength)
            .attr('x', d => x((d - startYear) * 5 + 2))
            .attr('transform', `translate(${x(-dayShift)},0)`);

    years.exit()
            .transition()
            .duration(transitionLength)
            .style('opacity', 1e-6)
            .remove();

    // Crew
    const crew = lines.selectAll('.line')
            .data(crews, d => d.gender + d.set.replace(/ /g, '') + d.name);

    const crewEnter = crew.enter()
            .append('g')
            .attr('class', d => `line ${d.name}`)
            .attr('transform', `translate(${x(-dayShift)},0)`)
            .classed('highlighted', d => d.highlighted)
            .classed('background', d => d.background)
            .style('stroke', d => (d.highlighted || d.hover ? crewColor(d.name) : '#000000'));

    crew.classed('highlighted', d => d.highlighted)
            .classed('background', d => d.background)
            .style('stroke', d => (d.highlighted || d.hover ? crewColor(d.name) : '#000000'))
            .transition()
            .duration(transitionLength)
            .attr('transform', `translate(${x(-dayShift)},0)`);

    crew.exit()
            .transition()
            .duration(transitionLength)
            .style('opacity', 1e-6)
            .remove();

    // CrewYear
    const crewYear = crewEnter.selectAll('path.active')
            .data(d => d.valuesSplit, d => d.gender + d.set.replace(/ /g, '') + d.name + d.day);

    crewYear.enter()
            .append('path')
            .attr('d', d => line(d.values))
            .attr('class', 'active')
            .classed('blades', d => d.blades)
            .classed('spoons', d => d.spoons)
            .style('cursor', 'pointer');

    crewYear.transition()
            .duration(transitionLength)
            .attr('d', d => line(d.values));

    crewYear.exit()
            .transition()
            .duration(transitionLength)
            .style('opacity', 1e-6)
            .remove();

    // CrewBackground
    const crewBackground = crewEnter.selectAll('path.background')
            .data(d => [d], d => d.gender + d.set.replace(/ /g, '') + d.name);

    crewBackground.enter()
            .append('path')
            .on('click', d => {
              ga('send', {
                hitType: 'event',
                eventCategory: 'Interaction',
                eventAction: 'click',
                eventLabel: bumps.renderName(d.name),
              });

              const index = crews.map(c => c.name).indexOf(d.name);
                
              if (crews[index].highlighted === true) {
                removeSelectedCrew(d.name);
              } else {
                addSelectedCrew(d.name);
              }

              this.update();
            })
            .on('mouseover', d => {
              ga('send', {
                hitType: 'event',
                eventCategory: 'Interaction',
                eventAction: 'mouseover',
                eventLabel: bumps.renderName(d.name),
              });

              const index = crews.map(c => c.name).indexOf(d.name);
              crews[index].hover = true;
              this.update();
            })
            .on('mouseout', d => {
              ga('send', {
                hitType: 'event',
                eventCategory: 'Interaction',
                eventAction: 'mouseout',
                eventLabel: bumps.renderName(d.name),
              });

              const index = crews.map(c => c.name).indexOf(d.name);
              crews[index].hover = false;
              this.update();
            })
            .attr('d', d => line(d.values))
            .attr('class', 'background')
            .style('cursor', 'pointer');

    crewBackground.transition()
            .duration(transitionLength)
            .attr('d', d => line(d.values));

    crewBackground.exit()
            .transition()
            .duration(transitionLength)
            .style('opacity', 1e-6)
            .remove();

    // FinishLabel
    const finishLabel = labelsGroup.selectAll('.finish-label')
            .data(crews.filter(d => d.values[d.values.length === finishLabelIndex ? finishLabelIndex - 1 : finishLabelIndex].pos > -1),
            d => d.set.replace(/ /g, '') + d.gender + d.name);

    finishLabel.enter()
            .filter(d =>
              d.values[d.values.length === finishLabelIndex ? finishLabelIndex - 1 : finishLabelIndex].pos > -1)
            .append('text')
            .on('click', d => {
              ga('send', {
                hitType: 'event',
                eventCategory: 'Interaction',
                eventAction: 'click',
                eventLabel: bumps.renderName(d.name),
              });

              const index = crews.map(c => c.name).indexOf(d.name);
                
              if (crews[index].highlighted === true) {
                removeSelectedCrew(d.name);
              } else {
                addSelectedCrew(d.name);
              }

              this.update();
            })
            .on('mouseover', d => {
              ga('send', {
                hitType: 'event',
                eventCategory: 'Interaction',
                eventAction: 'mouseover',
                eventLabel: bumps.renderName(d.name),
              });

              const index = crews.map(c => c.name).indexOf(d.name);
              crews[index].hover = true;
              this.update();
            })
            .on('mouseout', d => {
              ga('send', {
                hitType: 'event',
                eventCategory: 'Interaction',
                eventAction: 'mouseout',
                eventLabel: bumps.renderName(d.name),
              });

              const index = crews.map(c => c.name).indexOf(d.name);
              crews[index].hover = false;
              this.update();
            })
            .classed('label finish-label', true)
            .classed('highlighted', d => d.highlighted)
            .datum(d => ({ name: d.name, set: d.set, gender: d.gender, value: d.values[d.values.length === finishLabelIndex ? finishLabelIndex - 1 : finishLabelIndex] }))
            .attr('x', 10)
            .attr('dy', '.35em')
            .text(d => bumps.renderName(d.name))
            .attr('transform', d =>
              `translate(${x(finishLabelPosition + 5 * (numYearsToView - 1))},${y(d.value.pos)})`)
            .style('cursor', 'pointer');

    finishLabel.classed('highlighted', d => d.highlighted)
            .filter(d =>
              d.values[d.values.length === finishLabelIndex ? finishLabelIndex - 1 : finishLabelIndex].pos > -1)
            .transition()
            .duration(transitionLength)
            .attr('transform', d =>
              `translate(${x(finishLabelPosition + 5 * (numYearsToView - 1))},${y(d.values[d.values.length === finishLabelIndex ? finishLabelIndex - 1 : finishLabelIndex].pos)})`);

    finishLabel.exit()
            .remove();

    // StartLabel
    const startLabel = labelsGroup.selectAll('.start-label')
            .data(crews.filter(d => d.values[startLabelIndex].pos > -1),
            d => d.set.replace(/ /g, '') + d.gender + d.name);

    startLabel.enter()
            .filter(d => d.values[startLabelIndex].pos > -1)
            .append('text')
            .on('click', d => {
              ga('send', {
                hitType: 'event',
                eventCategory: 'Interaction',
                eventAction: 'click',
                eventLabel: bumps.renderName(d.name),
              });

              const index = crews.map(c => c.name).indexOf(d.name);
                
              if (crews[index].highlighted === true) {
                removeSelectedCrew(d.name);
              } else {
                addSelectedCrew(d.name);
              }
              
              this.update();
            })
            .on('mouseover', d => {
              ga('send', {
                hitType: 'event',
                eventCategory: 'Interaction',
                eventAction: 'mouseover',
                eventLabel: bumps.renderName(d.name),
              });

              const index = crews.map(c => c.name).indexOf(d.name);
              crews[index].hover = true;
              this.update();
            })
            .on('mouseout', d => {
              ga('send', {
                hitType: 'event',
                eventCategory: 'Interaction',
                eventAction: 'mouseout',
                eventLabel: bumps.renderName(d.name),
              });

              const index = crews.map(c => c.name).indexOf(d.name);
              crews[index].hover = false;
              this.update();
            })
            .classed('label start-label', true)
            .classed('highlighted', d => d.highlighted)
            .datum(d => ({ name: d.name, set: d.set, gender: d.gender, value: d.values[startLabelIndex] }))
            .attr('x', -10)
            .attr('dy', '.35em')
            .attr('text-anchor', 'end')
            .text(d => bumps.renderName(d.name))
            .attr('transform', d => `translate(${x(startLabelPosition)},${y(d.value.pos)})`)
            .style('cursor', 'pointer');


    startLabel.classed('highlighted', d => d.highlighted)
            .filter(d => d.values[startLabelIndex].pos > -1)
            .transition()
            .duration(transitionLength)
            .attr('transform', d => `translate(${x(startLabelPosition)},${y(d.values[startLabelIndex].pos)})`);

    startLabel.exit()
            .remove();

    // NumbersRight
    const numbersRight = labelsGroup.selectAll('.position-label-right')
            .data(d3.range(0, crews.filter(d =>
              d.values[d.values.length === finishLabelIndex ? finishLabelIndex - 1 : finishLabelIndex].pos > -1).length),
              d => d);

    numbersRight.enter()
            .append('text')
            .attr('class', 'position-label-right')
            .text((d, i) => i + 1)
            .style('fill', '#888888')
            .attr('dy', '.35em')
            .attr('text-anchor', 'end')
            .attr('transform', (d, i) => `translate(${x(numbersRightPosition + 5 * numYearsToView)},${y(i + 1)})`)
            .transition()
            .duration(transitionLength)
            .style('opacity', 1);

    numbersRight.transition()
            .duration(transitionLength)
            .attr('transform', (d, i) => `translate(${x(numbersRightPosition + 5 * numYearsToView)},${y(i + 1)})`);

    numbersRight.exit()
            .remove();

    // NumbersLeft
    const numbers = [];

    data.divisions[yearRelative].divisions.forEach(d => {
      for (let i = 0; i < d.length; i++) {
        numbers.push(i + 1);
      }
    });

    const numbersLeft = labelsGroup.selectAll('.position-label-left')
            .data(numbers, (d, i) => i);

    numbersLeft.enter()
            .append('text')
            .attr('class', 'position-label-left')
            .text(d => d)
            .style('fill', '#888888')
            .attr('dy', '.35em')
            .attr('text-anchor', 'start')
            .attr('transform', (d, i) => `translate(${x(numbersLeftPosition)},${y(i + 1)})`)
            .transition()
            .duration(transitionLength)
            .style('opacity', 1);

    numbersLeft.transition()
            .duration(transitionLength)
            .text(d => d)
            .attr('transform', (d, i) => `translate(${x(numbersLeftPosition)},${y(i + 1)})`);

    numbersLeft.exit()
            .remove();
  }

  render() {
    return (
      <div className="bumpsChart">
        <svg width="100%" preserveAspectRatio="xMidYMin">
        </svg>
      </div>
      );
  }
}

BumpsChart.propTypes = {
  data: React.PropTypes.object,
  year: React.PropTypes.object,
};
