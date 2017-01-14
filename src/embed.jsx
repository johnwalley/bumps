import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { joinEvents, transformData, calculateYearRange } from 'd3-bumps-chart';

import BumpsChart from './components/BumpsChart.jsx';
import events from '../results/generated.json';

require('./bumps.css');

injectTapEventPlugin();

function calculateNumYearsToview(width, focus) {
  const widthOfOneYear = 90;
  const widthWithoutLines = 310;

  return focus ? 0 : Math.max(0, Math.ceil((width - widthWithoutLines) / widthOfOneYear));
}

function pickEvents(events, gender, set) {
  const transformedEvents = events
    .filter(e => e.gender.toLowerCase() === gender.toLowerCase())
    .filter(e => e.set === set)
    .sort((a, b) => a.year - b.year)
    .map(event => transformData(event));

  return joinEvents(transformedEvents, set, gender);
}

export default class BumpsChartWidget extends React.Component {
  constructor(props) {
    super(props);

    const focus = true;

    this.state = {
      year: null,
      set: null,
      gender: null,
      selectedCrews: new Set(),
      highlightedCrew: null,
      events: events,
      windowWidth: 0,
      focus,
      container: '',
    };

    this.toggleSelectedCrew = this.toggleSelectedCrew.bind(this);
    this.highlightCrew = this.highlightCrew.bind(this);
  }

  componentDidMount() {
    const el = this.refs.bumpsContainer.parentNode;

    const year = { start: el.getAttribute('data-year'), end: el.getAttribute('data-year') };
    const crews = el.getAttribute('data-crew');
    const selectedCrews = new Set(crews ? crews.split(',') : '');
    const gender = el.getAttribute('data-gender');
    const set = el.getAttribute('data-set');
    const maxWidth = +el.getAttribute('data-width');
    const maxHeight = +el.getAttribute('data-height');
    const title = el.getAttribute('data-title');

    const chrome = el.getAttribute('data-chrome') ? el.getAttribute('data-chrome') : '';

    const chromeValues = chrome.split(' ');

    let border = false;
    let header = true;
    let footer = true;

    if (chromeValues.indexOf('noborder') === -1) {
      border = true;
    }

    if (chromeValues.indexOf('noheader') !== -1) {
      header = false;
    }

    if (chromeValues.indexOf('nofooter') !== -1) {
      footer = false;
    }

    this.setState({
      container: ReactDOM.findDOMNode(this).parentNode,
      title,
      year,
      set,
      gender,
      selectedCrews,
      maxWidth,
      maxHeight,
      border,
      header,
      footer,
      windowWidth: Math.min(maxWidth, el.scrollWidth),
    });

    const data = pickEvents(this.state.events, gender, set);

    const yearRange = calculateYearRange(year,
      { start: data.startYear, end: data.endYear },
      calculateNumYearsToview(el.scrollWidth, this.state.focus));

    this.setState({ set, selectedCrews, data, year: yearRange });
  }

  toggleSelectedCrew(crewName) {
    const selectedCrews = new Set(this.state.selectedCrews);

    if (selectedCrews.has(crewName)) {
      selectedCrews.delete(crewName);
    } else {
      selectedCrews.add(crewName);
    }

    this.setState({ selectedCrews });
  }

  highlightCrew(crewName) {
    this.setState({ highlightedCrew: crewName });
  }

  render() {
    const setMapInverse = {
      'May Bumps': 'mays',
      'Lent Bumps': 'lents',
      'Town Bumps': 'town',
    };

    const linkStyle = {
      color: 'darkslategray',
      fontSize: 12,
    };

    const header = this.state.header ? (<p>{this.state.title}</p>) : null;
    const footer = this.state.footer ? (
      <a className="widget" href={'http://www.cambridgebumps.com/' + setMapInverse[this.state.set] + '/' + this.state.gender + '/' + [...this.state.selectedCrews].map(crew => crew.replace(/ /g, '_')).join(',')} style={linkStyle}>
        View on cambridgebumps.com
  </a>
    ) : null;

    return (
      <div className="bumpsContainer" ref="bumpsContainer">
        {header}
        <BumpsChart
          data={this.state.data}
          year={this.state.year}
          selectedCrews={this.state.selectedCrews}
          highlightedCrew={this.state.highlightedCrew}
          toggleSelectedCrew={this.toggleSelectedCrew}
          highlightCrew={this.highlightCrew}
          maxWidth={this.state.maxWidth}
          maxHeight={this.state.maxHeight}
          border={this.state.border}
          windowWidth={this.state.windowWidth}
          focus
          />
        {footer}
      </div >
    );
  }
}

const elements = document.getElementsByClassName('bumps-chart');

Array.prototype.map.call(elements, el => ReactDOM.render((
  <BumpsChartWidget />
), el));
