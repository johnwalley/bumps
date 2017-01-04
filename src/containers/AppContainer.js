import { connect } from 'react-redux';
import { incrementYear, decrementYear, toggleDrawer, closeDrawer, setDrawer } from '../actions';
import App from '../components/App.jsx';

import { browserHistory } from 'react-router';

import { joinEvents, transformData, calculateYearRange, expandCrew } from 'd3-bumps-chart';

const setMapInverse = {
  'May Bumps': 'mays',
  'Lent Bumps': 'lents',
  'Town Bumps': 'town',
  'Torpids': 'torpids',
  'Summer Eights': 'eights',
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

function setUrl(set, gender, selectedCrews) {
  if (selectedCrews.size > 0) {
    browserHistory.push(`/${setMapInverse[set]}/${gender.toLowerCase()}/${[...selectedCrews].map(crew => crew.replace(/ /g, '_')).join(',')}`);
  } else {
    browserHistory.push(`/${setMapInverse[set]}/${gender.toLowerCase()}`);
  }
}

const getSet = (params) => {
  const setMap = {
    mays: 'May Bumps',
    lents: 'Lent Bumps',
    town: 'Town Bumps',
    torpids: 'Torpids',
    eights: 'Summer Eights',
  };

  let set = 'Town Bumps';

  if (params.eventId !== undefined) {
    const paramSet = params.eventId.toLowerCase();

    if (paramSet in setMap) {
      set = setMap[paramSet];
    }
  }

  return set;
}

const getGender = (params) => {
  const genderMap = {
    women: 'Women',
    men: 'Men',
  };

  let gender = 'Women';

  if (params.genderId !== undefined) {
    const paramGender = params.genderId.toLowerCase();

    if (paramGender in genderMap) {
      gender = genderMap[paramGender];
    }
  }

  return gender;
}

const getSelectedCrews = (params) => {
  let selectedCrews = new Set();

  if (params.crewId !== undefined) {
    selectedCrews = new Set(params.crewId.split(',').map(crew => crew.replace(/_/g, ' ')));
  }

  return selectedCrews;
}

const getResults = (events, set, gender) => {
  return pickEvents(events, gender, set);
}

const getYear = (year, results) => {
  return calculateYearRange(year, { start: results.startYear, end: results.endYear }, calculateNumYearsToview());
}

const mapStateToProps = (state, ownProps) => {
  const set = getSet(ownProps.params);
  const gender = getGender(ownProps.params);
  const selectedCrews = getSelectedCrews(ownProps.params);
  const results = getResults(state.ui.events, set, gender);
  const year = getYear(state.ui.year, results);

  if (ownProps.params.eventId === undefined || ownProps.params.genderId === undefined) {
    setUrl(set, gender, selectedCrews);
  }

  return {
    set,
    gender,
    selectedCrews,
    results,
    year,
    drawerOpen: state.ui.drawerOpen
  }
};

const mapDispatchToProps = ({
  onIncrementYearClick: incrementYear,
  onDecrementYearClick: decrementYear,
  onDrawerToggleClick: toggleDrawer,
  onDrawerCloseClick: closeDrawer,
  onSetDrawerClick: setDrawer
});

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default AppContainer;

