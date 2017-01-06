import { connect } from 'react-redux';
import { calculateYearRange } from 'd3-bumps-chart';

import { swipe, incrementYear, decrementYear, toggleDrawer, closeDrawer, setDrawer, clubSelectMenuOpen, clubSelectMenuClose } from '../actions';
import App from '../components/App.jsx';
import { calculateNumYearsToview, setUrl } from '../util';
import { getSet, getGender, getSelectedCrews, getResults, getClubs } from '../selectors';

const getYear = (year, width, results) =>
  calculateYearRange(year, { start: results.startYear, end: results.endYear }, calculateNumYearsToview(width));

const mapStateToProps = (state, ownProps) => {
  const set = getSet(state, ownProps);
  const gender = getGender(state, ownProps);
  const selectedCrews = getSelectedCrews(state, ownProps);
  const results = getResults(state, ownProps);
  const year = getYear(state.ui.year, state.ui.width, results);
  const clubs = getClubs(state, ownProps);

  if (ownProps.params.eventId === undefined || ownProps.params.genderId === undefined) {
    setUrl(set, gender, selectedCrews);
  }

  return {
    set,
    gender,
    selectedCrews,
    results,
    year,
    clubs,
    drawerOpen: state.ui.drawerOpen,
    clubSelectMenuOpen: state.ui.clubSelectMenuOpen,
    clubSelectMenuAnchorElement: state.ui.clubSelectMenuAnchorElement
  };
};

const mapDispatchToProps = ({
  onSwipe: swipe,
  onIncrementYearClick: incrementYear,
  onDecrementYearClick: decrementYear,
  onDrawerToggleClick: toggleDrawer,
  onDrawerCloseClick: closeDrawer,
  onSetDrawerClick: setDrawer,
  onClubSelectOpenClick: clubSelectMenuOpen,
  onClubSelectRequestClose: clubSelectMenuClose
});

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default AppContainer;
