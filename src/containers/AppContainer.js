import { connect } from 'react-redux';

import { setYear, swipe, incrementYear, decrementYear, toggleDrawer, closeDrawer, setDrawer, clubSelectMenuOpen, clubSelectMenuClose } from '../actions';
import App from '../components/App.jsx';
import { setUrl } from '../util';
import { getSet, getGender, getSelectedCrews, getResults, getClubs, getYear } from '../selectors';

const mapStateToProps = (state, ownProps) => {
  const set = getSet(state, ownProps);
  const gender = getGender(state, ownProps);
  const selectedCrews = getSelectedCrews(state, ownProps);
  const results = getResults(state, ownProps);
  const year = getYear(state, ownProps);
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
    width: state.ui.width,
    drawerOpen: state.ui.drawerOpen,
    clubSelectMenuOpen: state.ui.clubSelectMenuOpen,
    clubSelectMenuAnchorElement: state.ui.clubSelectMenuAnchorElement
  };
};

const mapDispatchToProps = ({
  onSetYear: setYear,
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
