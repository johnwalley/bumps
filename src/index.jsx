import React from 'react';
import ReactDOM from 'react-dom';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

import Help from 'material-ui/svg-icons/action/help';
import Error from 'material-ui/svg-icons/alert/error';
import Create from 'material-ui/svg-icons/content/create';

import Hammer from 'react-hammerjs';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Router, Route, browserHistory } from 'react-router';
import { joinEvents, transformData, calculateYearRange } from 'd3-bumps-chart';

import BumpsChart from './BumpsChart.jsx';
import BumpsChartControls from './BumpsChartControls.jsx';
import events from '../results/generated.json';

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

export default class BumpsChartApp extends React.Component {
  constructor(props) {
    super(props);

    let set = 'Town Bumps';

    if (this.props.params.eventId !== undefined) {
      const paramSet = this.props.params.eventId.toLowerCase();

      if (paramSet in setMap) {
        set = setMap[paramSet];
      }
    }

    let gender = 'Women';

    if (this.props.params.genderId !== undefined) {
      const paramGender = this.props.params.genderId.toLowerCase();

      if (paramGender in genderMap) {
        gender = genderMap[paramGender];
      }
    }

    let selectedCrews = new Set();

    if (this.props.params.crewId !== undefined) {
      selectedCrews = new Set(this.props.params.crewId.split(',').map(crew => crew.replace(/_/g, ' ')));
    }

    this.state = {
      results: null,
      year: null,
      set: set,
      gender: gender,
      selectedCrews,
      highlightedCrew: null,
      events: events,
      drawerOpen: false,
    };

    this.incrementYear = this.incrementYear.bind(this);
    this.decrementYear = this.decrementYear.bind(this);
    this.addSelectedCrew = this.addSelectedCrew.bind(this);
    this.removeSelectedCrew = this.removeSelectedCrew.bind(this);
    this.highlightCrew = this.highlightCrew.bind(this);
    this.updateGender = this.updateGender.bind(this);
    this.updateSet = this.updateSet.bind(this);
    this.updateResults = this.updateResults.bind(this);
    this.handleSwipe = this.handleSwipe.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
  }

  componentDidMount() {
    ga('send', {
      hitType: 'event',
      eventCategory: 'Platform',
      eventAction: 'load',
      eventLabel: window.innerWidth,
    });

    this.updateSet(null, null, this.state.set);

    window.addEventListener('resize', this.handleResize);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(event) {
    if (event.keyCode === 37) {
      ga('send', {
        hitType: 'event',
        eventCategory: 'Interaction',
        eventAction: 'keydown',
        eventLabel: 'left',
      });

      this.decrementYear();
    } else if (event.keyCode === 39) {
      ga('send', {
        hitType: 'event',
        eventCategory: 'Interaction',
        eventAction: 'keydown',
        eventLabel: 'right',
      });

      this.incrementYear();
    }
  }

  handleResize() {
    ga('send', {
      hitType: 'event',
      eventCategory: 'Platform',
      eventAction: 'resize',
      eventLabel: window.document.body.clientWidth,
    });

    const yearRange = calculateYearRange(this.state.year, { start: this.state.results.startYear, end: this.state.results.endYear }, calculateNumYearsToview());
    this.setState({ year: yearRange });
  }

  incrementYear() {
    if (this.state.year.end < this.state.results.endYear) {
      this.setState({ year: { start: this.state.year.start + 1, end: this.state.year.end + 1 } });
    }
  }

  decrementYear() {
    if (this.state.year.start > this.state.results.startYear) {
      this.setState({ year: { start: this.state.year.start - 1, end: this.state.year.end - 1 } });
    }
  }

  addSelectedCrew(crewName) {
    const selectedCrews = this.state.selectedCrews.add(crewName);
    this.setState({ selectedCrews: selectedCrews });

    if (selectedCrews.size > 0) {
      browserHistory.push(`/${setMapInverse[this.state.set]}/${this.state.gender.toLowerCase()}/${[...selectedCrews].map(crew => crew.replace(/ /g, '_')).join(',')}`);
    } else {
      browserHistory.push(`/${setMapInverse[this.state.set]}/${this.state.gender.toLowerCase()}`);
    }
  }

  removeSelectedCrew(crewName) {
    const selectedCrews = this.state.selectedCrews;
    selectedCrews.delete(crewName);

    this.setState({ selectedCrews: selectedCrews });

    if (selectedCrews.size > 0) {
      browserHistory.push(`/${setMapInverse[this.state.set]}/${this.state.gender.toLowerCase()}/${[...selectedCrews].map(crew => crew.replace(/ /g, '_')).join(',')}`);
    } else {
      browserHistory.push(`/${setMapInverse[this.state.set]}/${this.state.gender.toLowerCase()}`);
    }
  }

  highlightCrew(crewName) {
    this.setState({ highlightedCrew: crewName });
  }

  updateGender(event, index, gender) {
    ga('send', {
      hitType: 'event',
      eventCategory: 'Data',
      eventAction: 'update_gender',
      eventLabel: gender,
    });

    this.updateResults(this.state.set, gender);
  }

  updateSet(event, index, set) {
    ga('send', {
      hitType: 'event',
      eventCategory: 'Data',
      eventAction: 'update_set',
      eventLabel: set,
    });

    this.updateResults(set, this.state.gender);
  }

  updateResults(set, gender) {
    const selectedCrews = this.state.selectedCrews;

    if (set !== this.state.set) {
      selectedCrews.clear();
    }

    const results = pickEvents(this.state.events, this.state.gender, set);
    const yearRange = calculateYearRange(this.state.year, { start: results.startYear, end: results.endYear }, calculateNumYearsToview());

    this.setState({ set: set, selectedCrews: selectedCrews, results: results, year: yearRange });

    if (selectedCrews.size > 0) {
      browserHistory.push(`/${setMapInverse[set]}/${gender.toLowerCase()}/${[...selectedCrews].map(crew => crew.replace(/ /g, '_')).join(',')}`);
    } else {
      browserHistory.push(`/${setMapInverse[set]}/${gender.toLowerCase()}`);
    }
  }

  handleSwipe(event) {
    ga('send', {
      hitType: 'event',
      eventCategory: 'Interaction',
      eventAction: 'swipe',
      eventLabel: event.deltaX > 0 ? 'left' : 'right',
    });

    if (event.deltaX > 0) {
      this.decrementYear();
    } else {
      this.incrementYear();
    }
  }

  handleDrawerToggle() {
    ga('send', {
      hitType: 'event',
      eventCategory: 'Interaction',
      eventAction: 'hamburger',
    });

    this.setState({ drawerOpen: !this.state.drawerOpen });
  }

  handleDrawerClose() {
    ga('send', {
      hitType: 'event',
      eventCategory: 'Interaction',
      eventAction: 'hamburger',
    });

    this.setState({ drawerOpen: false });
  }

  render() {
    const controls = (
      <div>
        <SelectField value={this.state.set} onChange={this.updateSet} style={styles.setSelectStyle}>
          <MenuItem value="May Bumps" primaryText="May Bumps" />
          <MenuItem value="Town Bumps" primaryText="Town Bumps" />
          <MenuItem value="Lent Bumps" primaryText="Lent Bumps" />
          <MenuItem value="Torpids" primaryText="Torpids" />
          <MenuItem value="Summer Eights" primaryText="Summer Eights" />
        </SelectField>
        <SelectField value={this.state.gender} onChange={this.updateGender} style={styles.genderSelectStyle}>
          <MenuItem value="Women" primaryText="Women" />
          <MenuItem value="Men" primaryText="Men" />
        </SelectField>
      </div>
    );

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="bumpsContainer">
          <AppBar iconElementRight={controls} onLeftIconButtonTouchTap={this.handleDrawerToggle} style={styles.customToolbar} />
          <BumpsChartControls incrementYear={this.incrementYear} decrementYear={this.decrementYear} url={window.location.toString()} />
          <Drawer
            docked={false}
            width={240}
            open={this.state.drawerOpen}
            onRequestChange={open => this.setState({ drawerOpen: open })}
            >
            <h2 style={{ paddingLeft: '12px' }}>Cambridge Bumps</h2>
            <MenuItem leftIcon={<Help />} onTouchTap={this.handleDrawerClose}><a href="http://www.cucbc.org/bumps/how_bumps_work">How bumps work</a></MenuItem>
            <Divider />
            <MenuItem leftIcon={<Error />} onTouchTap={this.handleDrawerClose}><a href="mailto:john@walley.org.uk?subject=I've%20spotted%20an%20error%20on%20Cambridge%20Bumps">Spotted an error?</a></MenuItem>
            <MenuItem leftIcon={<Create />} onTouchTap={this.handleDrawerClose}><a href="mailto:john@walley.org.uk?subject=I've%20got%20a%20great%20idea">Suggest a feature!</a></MenuItem>
          </Drawer>
          <Hammer onSwipe={this.handleSwipe}>
            <BumpsChart
              data={this.state.results}
              year={this.state.year}
              selectedCrews={this.state.selectedCrews}
              highlightedCrew={this.state.highlightedCrew}
              addSelectedCrew={this.addSelectedCrew}
              removeSelectedCrew={this.removeSelectedCrew}
              highlightCrew={this.highlightCrew}
              focus={false}
              />
          </Hammer>
        </div >
      </MuiThemeProvider>
    );
  }
}

BumpsChartApp.propTypes = { params: React.PropTypes.object };

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={BumpsChartApp} />
    <Route path=":eventId" component={BumpsChartApp} />
    <Route path=":eventId/:genderId" component={BumpsChartApp} />
    <Route path=":eventId/:genderId/:crewId" component={BumpsChartApp} />
  </Router>
), document.getElementById('content')
);
