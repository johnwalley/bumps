import React from 'react';
import ReactDOM from 'react-dom';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import Drawer from 'material-ui/Drawer';
import Hammer from 'react-hammerjs';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Router, Route, browserHistory } from 'react-router';
import BumpsChart from './BumpsChart.jsx';
import BumpsChartControls from './BumpsChartControls.jsx';
import results from '../results/generated.json';

require('./bumps.css');
const bumps = require('./bumps.js');

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
    width: 140,
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
};

const setMapInverse = {
  'May Bumps': 'mays',
  'Lent Bumps': 'lents',
  'Town Bumps': 'town',
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
    .map(event => bumps.transformData(event));

  return bumps.joinEvents(transformedEvents, set, gender);
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
      selectedCrews = new Set(this.props.params.crewId.split(',').map(crew => crew.replace(/_/g,' ')));
    }

    this.state = {
      year: null,
      set: set,
      gender: gender,
      selectedCrews: selectedCrews,
      events: results,
      windowWidth: window.innerWidth,
      open: false,
    };

    this.incrementYear = this.incrementYear.bind(this);
    this.decrementYear = this.decrementYear.bind(this);
    this.addSelectedCrew = this.addSelectedCrew.bind(this);
    this.removeSelectedCrew = this.removeSelectedCrew.bind(this);
    this.updateGender = this.updateGender.bind(this);
    this.updateSet = this.updateSet.bind(this);
    this.handleSwipe = this.handleSwipe.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleHamburger = this.handleHamburger.bind(this);
    this.handleClose = this.handleClose.bind(this);
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
      eventLabel: window.innerWidth,
    });

    this.setState({ windowWidth: window.innerWidth });

    const yearRange = bumps.calculateYearRange(this.state.year, { start: this.state.data.startYear, end: this.state.data.endYear }, calculateNumYearsToview());

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

  updateGender(event, index, gender) {
    ga('send', {
      hitType: 'event',
      eventCategory: 'Data',
      eventAction: 'update_gender',
      eventLabel: gender,
    });

    const selectedCrews = this.state.selectedCrews;

    if (gender !== this.state.gender) {
      selectedCrews.clear();
    }

    const data = pickEvents(this.state.events, gender, this.state.set);
    const yearRange = bumps.calculateYearRange(this.state.year, { start: data.startYear, end: data.endYear }, calculateNumYearsToview());

    this.setState({ gender: gender, selectedCrews: selectedCrews, data: data, year: yearRange });

    if (selectedCrews.size > 0) {
      browserHistory.push(`/${setMapInverse[this.state.set]}/${gender.toLowerCase()}/${[...selectedCrews].map(crew => crew.replace(/ /g, '_')).join(',')}`);
    } else {
      browserHistory.push(`/${setMapInverse[this.state.set]}/${gender.toLowerCase()}`);
    }
  }

  updateSet(event, index, set) {
    ga('send', {
      hitType: 'event',
      eventCategory: 'Data',
      eventAction: 'update_set',
      eventLabel: set,
    });

    const selectedCrews = this.state.selectedCrews;

    if (set !== this.state.set) {
      selectedCrews.clear();
    }

    const data = pickEvents(this.state.events, this.state.gender, set);

    const yearRange = bumps.calculateYearRange(this.state.year, { start: data.startYear, end: data.endYear }, calculateNumYearsToview());

    this.setState({ set: set, selectedCrews: selectedCrews, data: data, year: yearRange });

    if (selectedCrews.size > 0) {
      browserHistory.push(`/${setMapInverse[set]}/${this.state.gender.toLowerCase()}/${[...selectedCrews].map(crew => crew.replace(/ /g, '_')).join(',')}`);
    } else {
      browserHistory.push(`/${setMapInverse[set]}/${this.state.gender.toLowerCase()}`);
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

  handleHamburger() {
    ga('send', {
      hitType: 'event',
      eventCategory: 'Interaction',
      eventAction: 'hamburger',
    });

    this.setState({ open: !this.state.open });
  }

  handleClose() {
    ga('send', {
      hitType: 'event',
      eventCategory: 'Interaction',
      eventAction: 'hamburger',
    });

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
          <MenuItem value="Summer Eights" primaryText="Summer Eights" disabled />
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
          <AppBar iconElementRight={controls} onLeftIconButtonTouchTap={this.handleHamburger} style={styles.customToolbar} />
          <BumpsChartControls incrementYear={this.incrementYear} decrementYear={this.decrementYear} />
          <Drawer
            docked={false}
            width={200}
            open={this.state.open}
            onRequestChange={(open) => this.setState({ open })}
          >
            <MenuItem onTouchTap={this.handleClose}><a href="/town/women">Live women's results</a></MenuItem>
            <MenuItem onTouchTap={this.handleClose}><a href="/town/men">Live men's results</a></MenuItem>
            <MenuItem onTouchTap={this.handleClose}><a href="http://www.cucbc.org/bumps/how_bumps_work">How bumps work</a></MenuItem>
            <MenuItem onTouchTap={this.handleClose}><a href="mailto:john@walley.org.uk?subject=I've%20spotted%20an%20error%20in%20your%20bumpscharts">Spotted an error?</a></MenuItem>
            <MenuItem onTouchTap={this.handleClose}><a href="mailto:john@walley.org.uk?subject=I've%20got%20a%20great%20idea">Suggest a feature</a></MenuItem>
          </Drawer>
          <Hammer onSwipe={this.handleSwipe}>
            <BumpsChart
              data={this.state.data}
              year={this.state.year}
              selectedCrews={this.state.selectedCrews}
              addSelectedCrew={this.addSelectedCrew}
              removeSelectedCrew={this.removeSelectedCrew}
              windowWidth={this.state.windowWidth}
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
