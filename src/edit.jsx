import React from 'react';
import ReactDOM from 'react-dom';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import Drawer from 'material-ui/Drawer';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Router, Route, browserHistory } from 'react-router';
import { joinEvents, transformData, calculateYearRange, write_tg, read_tg } from 'd3-bumps-chart';

import BumpsChart from './components/BumpsChart.jsx';
import results from '../results/generated.json';

require('./bumps.css');

injectTapEventPlugin();

const muiTheme = getMuiTheme(darkBaseTheme, {
  palette: {
    accent1Color: '#91B9A4',
  },
  appBar: {
    color: '#FFFFFF',
    textColor: '#FFFFFF',
  },
});

const styles = {
  customToolbar: {
    backgroundColor: '#91B9A4', // Oxford Blue: #002147, Cambridge Blue: #91B9A4
    textColor: '#FFFFFF',
  },
  setSelectStyle: {
    width: 150,
    fontSize: '14px',
  },
  genderSelectStyle: {
    width: 100,
    fontSize: '14px',
  },
  yearSelectStyle: {
    width: 100,
    fontSize: '14px',
  },
  customTextFieldStyle: {
    width: '100%',
  },
  customTextareaStyle: {
    fontSize: '12px',
    color: '#000000',
  },
};

const setMap = {
  mays: 'May Bumps',
  lents: 'Lent Bumps',
  town: 'Town Bumps',
  eights: 'Summer Eights',
};

const setMapInverse = {
  'May Bumps': 'mays',
  'Lent Bumps': 'lents',
  'Town Bumps': 'town',
  'Summer Eights': 'eights',
};

const genderMap = {
  women: 'Women',
  men: 'Men',
};

function range(start, end) {
  return [...Array(1 + end - start).keys()].map(v => start + v)
}

function calculateNumYearsToview() {
  const width = window.innerWidth;
  const widthOfOneYear = 80;
  const widthWithoutLines = 310;

  return Math.max(0, Math.ceil((width - widthWithoutLines) / widthOfOneYear));
}

function pickEvents(events, gender, set) {
  const transformedEvents = events
    .filter(e => e.gender.toLowerCase() === gender.toLowerCase())
    .filter(e => e.set === set)
    .sort((a, b) => a.year - b.year)
    .map(event => transformData(event));

  return joinEvents(transformedEvents, set, gender);
}

export default class BumpsChartEdit extends React.Component {
  constructor(props) {
    super(props);

    let set = 'Town Bumps';
    let gender = 'Women';
    let selectedCrews = new Set();

    this.state = {
      year: null,
      currentYear: 2016,
      set: set,
      gender: gender,
      resultsText: null,
      selectedCrews,
      highlightedCrew: null,
      events: results,
      windowWidth: window.innerWidth,
      open: false,
    };

    this.incrementYear = this.incrementYear.bind(this);
    this.decrementYear = this.decrementYear.bind(this);
    this.addSelectedCrew = this.addSelectedCrew.bind(this);
    this.removeSelectedCrew = this.removeSelectedCrew.bind(this);
    this.highlightCrew = this.highlightCrew.bind(this);
    this.updateYear = this.updateYear.bind(this);
    this.updateGender = this.updateGender.bind(this);
    this.updateSet = this.updateSet.bind(this);
    this.updateResultsText = this.updateResultsText.bind(this);
    this.handleSwipe = this.handleSwipe.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleHamburger = this.handleHamburger.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.updateSet(null, null, this.state.set);

    window.addEventListener('resize', this.handleResize);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(event) {
    if (event.keyCode === 37) {
      this.decrementYear();
    } else if (event.keyCode === 39) {
      this.incrementYear();
    }
  }

  handleResize() {
    this.setState({ windowWidth: window.innerWidth });

    const yearRange = calculateYearRange(this.state.year, { start: this.state.data.startYear, end: this.state.data.endYear }, calculateNumYearsToview());

    this.setState({ year: yearRange });
  }

  incrementYear() {
    if (this.state.year.end < this.state.data.endYear) {
      this.setState({ year: { start: this.state.year.start + 1, end: this.state.year.end + 1 } });
    }
  }

  decrementYear() {
    if (this.state.year.start > this.state.data.startYear) {
      this.setState({ year: { start: this.state.year.start - 1, end: this.state.year.end - 1 } });
    }
  }

  addSelectedCrew(crewName) {
    const selectedCrews = this.state.selectedCrews.add(crewName);
    this.setState({ selectedCrews: selectedCrews });
  }

  removeSelectedCrew(crewName) {
    const selectedCrews = this.state.selectedCrews;
    selectedCrews.delete(crewName);

    this.setState({ selectedCrews: selectedCrews });
  }

  highlightCrew(crewName) {
    this.setState({ highlightedCrew: crewName });
  }

  updateYear(e, index, year) {
    const text = write_tg(this.state.events
      .filter(e => e.gender.toLowerCase() === this.state.gender.toLowerCase())
      .filter(e => e.set === this.state.set)
      .filter(e => e.year === year)[0])

    this.setState({ currentYear: year, resultsText: text });
  }

  updateGender(e, index, gender) {
    const selectedCrews = this.state.selectedCrews;

    if (gender !== this.state.gender) {
      selectedCrews.clear();
    }

    const data = pickEvents(this.state.events, gender, this.state.set);
    const yearRange = calculateYearRange(this.state.year, { start: data.startYear, end: data.endYear }, calculateNumYearsToview());

    const text = write_tg(this.state.events
      .filter(e => e.gender.toLowerCase() === gender.toLowerCase())
      .filter(e => e.set === this.state.set)
      .filter(e => e.year === this.state.currentYear)[0])

    this.setState({ gender: gender, selectedCrews: selectedCrews, data: data, year: yearRange, resultsText: text });
  }

  updateSet(e, index, set) {
    const selectedCrews = this.state.selectedCrews;

    if (set !== this.state.set) {
      selectedCrews.clear();
    }

    const data = pickEvents(this.state.events, this.state.gender, set);
    const yearRange = calculateYearRange(this.state.year, { start: data.startYear, end: data.endYear }, calculateNumYearsToview());

    const text = write_tg(this.state.events
      .filter(e => e.gender.toLowerCase() === this.state.gender.toLowerCase())
      .filter(e => e.set === set)
      .filter(e => e.year === this.state.currentYear)[0])

    this.setState({ set: set, selectedCrews: selectedCrews, data: data, year: yearRange, resultsText: text });
  }

  updateResultsText(e, text) {
    let d = null;

    d = read_tg(text);

    const event = joinEvents([transformData(d)], d.set, Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5));

    const selectedCrews = this.state.selectedCrews;

    selectedCrews.clear();

    const data = event;

    const yearRange = calculateYearRange(this.state.year, { start: data.startYear, end: data.endYear }, calculateNumYearsToview());

    this.setState({ selectedCrews: selectedCrews, data: data, currentYear: yearRange.start, year: yearRange, resultsText: text });
  }

  handleSwipe(event) {
    if (event.deltaX > 0) {
      this.decrementYear();
    } else {
      this.incrementYear();
    }
  }

  handleHamburger() {
    this.setState({ open: !this.state.open });
  }

  handleClose() {
    this.setState({ open: false });
  }

  render() {
    const controls = (
      <div>
        <SelectField value={this.state.set} onChange={this.updateSet} style={styles.setSelectStyle}>
          <MenuItem value="May Bumps" primaryText="May Bumps" />
          <MenuItem value="Town Bumps" primaryText="Town Bumps" />
          <MenuItem value="Lent Bumps" primaryText="Lent Bumps" />
          <MenuItem value="Torpids" primaryText="Torpids" disabled />
          <MenuItem value="Summer Eights" primaryText="Summer Eights" />
        </SelectField>
        <SelectField value={this.state.gender} onChange={this.updateGender} style={styles.genderSelectStyle}>
          <MenuItem value="Women" primaryText="Women" />
          <MenuItem value="Men" primaryText="Men" />
        </SelectField>
        <SelectField value={this.state.currentYear} onChange={this.updateYear} style={styles.yearSelectStyle}>
          {this.state.year === null ? "" : range(this.state.year.start, this.state.year.end + 1).map(y =>
            (
              <MenuItem value={y} primaryText={y} />
            )
          )}
        </SelectField>
      </div>
    );

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="bumpsContainer">
          <AppBar iconElementRight={controls} onLeftIconButtonTouchTap={this.handleHamburger} style={styles.customToolbar} />
          <Drawer
            docked={false}
            width={200}
            open={this.state.open}
            onRequestChange={(open) => this.setState({ open })}
            >
            <MenuItem onTouchTap={this.handleClose}><a href="http://www.cucbc.org/bumps/how_bumps_work">How bumps work</a></MenuItem>
            <MenuItem onTouchTap={this.handleClose}><a href="mailto:john@walley.org.uk?subject=I've%20spotted%20an%20error%20in%20your%20bumpscharts">Spotted an error?</a></MenuItem>
            <MenuItem onTouchTap={this.handleClose}><a href="mailto:john@walley.org.uk?subject=I've%20got%20a%20great%20idea">Suggest a feature</a></MenuItem>
            <MenuItem onTouchTap={this.handleClose}><a href="https://github.com/johnwalley/bumps/">Source code</a></MenuItem>
          </Drawer>
          <div className="editContainer">
            <TextField
              hintText="Results"
              multiLine={true}
              rows={16}
              onChange={this.updateResultsText}
              style={styles.customTextFieldStyle}
              textareaStyle={styles.customTextareaStyle}
              value={this.state.resultsText}
              />
            <BumpsChart
              data={this.state.data}
              year={{ start: this.state.currentYear, end: this.state.currentYear }}
              selectedCrews={this.state.selectedCrews}
              highlightedCrew={this.state.highlightedCrew}
              addSelectedCrew={this.addSelectedCrew}
              removeSelectedCrew={this.removeSelectedCrew}
              highlightCrew={this.highlightCrew}
              windowWidth="300px"
              focus={false}
              />
          </div>
        </div >
      </MuiThemeProvider>
    );
  }
}

BumpsChartEdit.propTypes = { params: React.PropTypes.object };

ReactDOM.render((
  <BumpsChartEdit />
), document.getElementById('content')
);
