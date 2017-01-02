import React from 'react';
import ReactDOM from 'react-dom';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Menu from 'material-ui/Menu';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import SelectField from 'material-ui/SelectField';

import Help from 'material-ui/svg-icons/action/help';
import Error from 'material-ui/svg-icons/alert/error';
import Create from 'material-ui/svg-icons/content/create';

import MediaQuery from 'react-responsive';
import Hammer from 'react-hammerjs';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Router, Route, browserHistory } from 'react-router';
import { joinEvents, transformData, calculateYearRange, expandCrew } from 'd3-bumps-chart';

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
  button: {
    textTransform: 'capitalize'
  },
});

const styles = {
  customToolbar: {
    backgroundColor: '#91B9A4', // Oxford Blue: #002147, Cambridge Blue: #91B9A4
    textColor: '#FFFFFF',
  },
  setSelectStyle: {
    width: 146,
    fontSize: '14px',
  },
  genderSelectStyle: {
    width: 100,
    fontSize: '14px',
  },
  clubSelectStyle: {
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

function pickEvents(events, gender, set, yearRange = [-Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]) {
  const transformedEvents = events
    .filter(e => e.gender.toLowerCase() === gender.toLowerCase())
    .filter(e => e.set === set)
    .filter(e => e.year >= yearRange[0] && e.year <= yearRange[1])
    .sort((a, b) => a.year - b.year)
    .map(event => transformData(event));

  return joinEvents(transformedEvents, set, gender);
}

function extractClubs(events, fullData, gender, set, numClubs = 8) {
  const numYears = calculateNumYearsToview();
  const data = pickEvents(events, gender, set, [fullData.endYear - numYears, fullData.endYear]);

  const rawClubs = data.crews.map(crew => crew.name.replace(/[0-9]+$/, '').trim());
  const uniqueClubs = new Set(data.crews.map(crew => crew.name.replace(/[0-9]+$/, '').trim()));
  const histogram = [...uniqueClubs.values()].map(club => ({ club: club, count: rawClubs.filter(c => c === club).length }));
  const sortedHistogram = histogram.sort((a, b) => b.count - a.count);

  if (set != 'Town Bumps') {
    numClubs = sortedHistogram.length;
  }

  const topNClubs = sortedHistogram.slice(0, numClubs).map(c => c.club);

  return topNClubs.sort((a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  })
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
      gender: gender,
      set: set,
      selectedClub: null,
      clubs: null,
      selectedCrews,
      highlightedCrew: null,
      events: events,
      drawerOpen: false,
      buttonOpen: false,
    };

    this.incrementYear = this.incrementYear.bind(this);
    this.decrementYear = this.decrementYear.bind(this);
    this.addSelectedCrew = this.addSelectedCrew.bind(this);
    this.removeSelectedCrew = this.removeSelectedCrew.bind(this);
    this.highlightCrew = this.highlightCrew.bind(this);
    this.updateGender = this.updateGender.bind(this);
    this.updateSet = this.updateSet.bind(this);
    this.updateResults = this.updateResults.bind(this);
    this.updateClub = this.updateClub.bind(this);
    this.handleSwipe = this.handleSwipe.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleButtonTouchTap = this.handleButtonTouchTap.bind(this);
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.handleButtonRequestClose = this.handleButtonRequestClose.bind(this);
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

    const results = pickEvents(this.state.events, gender, set);
    const yearRange = calculateYearRange(this.state.year, { start: results.startYear, end: results.endYear }, calculateNumYearsToview());

    const clubs = extractClubs(this.state.events, results, this.state.gender, set);

    this.setState({ set: set, gender: gender, clubs: clubs, selectedClub: clubs[0], selectedCrews: selectedCrews, results: results, year: yearRange });

    if (selectedCrews.size > 0) {
      browserHistory.push(`/${setMapInverse[set]}/${gender.toLowerCase()}/${[...selectedCrews].map(crew => crew.replace(/ /g, '_')).join(',')}`);
    } else {
      browserHistory.push(`/${setMapInverse[set]}/${gender.toLowerCase()}`);
    }
  }

  updateClub(event, menuItem, index) {
    const club = expandCrew(this.state.clubs[index], this.state.set);
    const selectedCrews = new Set(this.state.results.crews.filter(crew => (expandCrew(crew.name, this.state.set).indexOf(club) != -1)).map(crew => crew.name));

    this.setState({ selectedClub: club, selectedCrews: selectedCrews });

    this.handleButtonRequestClose();

    browserHistory.push(`/${setMapInverse[this.state.set]}/${this.state.gender.toLowerCase()}/${[...selectedCrews].map(crew => crew.replace(/ /g, '_')).join(',')}`);
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

  handleButtonTouchTap(event) {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      buttonOpen: true,
      anchorEl: event.currentTarget,
    });
  };

  handleDrawerClose() {
    ga('send', {
      hitType: 'event',
      eventCategory: 'Interaction',
      eventAction: 'hamburger',
    });

    this.setState({ drawerOpen: false });
  }

  handleButtonRequestClose() {
    this.setState({ buttonOpen: false });
  }

  render() {
    const controls = (
      <div style={{ display: 'flex' }}>
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
        <MediaQuery minWidth={780}>
          <FlatButton
            onTouchTap={this.handleButtonTouchTap}
            label="Highlight Club"
            backgroundColor="#91B9A4"
            labelStyle={styles.clubSelectStyle}
            style={{ padding: '6px 0px 0px 0px' }}
            />
          <Popover
            open={this.state.buttonOpen}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            targetOrigin={{ horizontal: 'left', vertical: 'top' }}
            onRequestClose={this.handleButtonRequestClose}
            >
            <Menu onItemTouchTap={this.updateClub} >
              {this.state.clubs !== null ? this.state.clubs.map(club => (
                <MenuItem primaryText={expandCrew(club, this.state.set)} />
              )) : null}
            </Menu>
          </Popover>
        </MediaQuery>
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
