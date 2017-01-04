import React from 'react';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

import MediaQuery from 'react-responsive';
import Hammer from 'react-hammerjs';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Router, Route, browserHistory } from 'react-router';
import { calculateYearRange, expandCrew } from 'd3-bumps-chart';

import BumpsChartContainer from '../containers/BumpsChartContainer';

import EventControls from './EventControls.jsx';
import BumpsDrawer from './BumpsDrawer.jsx';
import BumpsChartControls from './BumpsChartControls.jsx';

require('../bumps.css');

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
};

const setMapInverse = {
  'May Bumps': 'mays',
  'Lent Bumps': 'lents',
  'Town Bumps': 'town',
  'Torpids': 'torpids',
  'Summer Eights': 'eights',
};

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

function setSet(newSet, set, gender, selectedCrews) {
  if (newSet !== set) {
    selectedCrews.clear();
  }

  setUrl(newSet, gender, selectedCrews);
}

function setGender(newGender, set, gender, selectedCrews) {
  if (newGender !== gender) {
    selectedCrews.clear();
  }

  setUrl(set, newGender, selectedCrews);
}

function toggleSelectedCrew(crew, set, gender, selectedCrews) {
  // FIXME: This mutates state!
  if (selectedCrews.has(crew)) {
    selectedCrews.delete(crew);
  } else {
    selectedCrews.add(crew);
  }

  setUrl(set, gender, selectedCrews);
}

function setUrl(set, gender, selectedCrews) {
  if (selectedCrews.size > 0) {
    browserHistory.push(`/${setMapInverse[set]}/${gender.toLowerCase()}/${[...selectedCrews].map(crew => crew.replace(/ /g, '_')).join(',')}`);
  } else {
    browserHistory.push(`/${setMapInverse[set]}/${gender.toLowerCase()}`);
  }
}

const App = ({set, gender, selectedCrews, results, year,
  onIncrementYearClick, onDecrementYearClick,
  onDrawerToggleClick, drawerOpen, onSetDrawerClick, onDrawerCloseClick}) => {

  return (
    <MuiThemeProvider muiTheme={muiTheme}>
      <div className="bumpsContainer" onKeyDown={(keyCode) => { console.log(keyCode); } }>
        <AppBar
          iconElementRight={<EventControls
            set={set}
            gender={gender}
            onSetClick={(newSet) => setSet(newSet, set, gender, selectedCrews)}
            onGenderClick={(newGender) => setGender(newGender, set, gender, selectedCrews)} />}
          onLeftIconButtonTouchTap={() => onDrawerToggleClick()}
          style={styles.customToolbar} />
        <BumpsDrawer
          drawerOpen={drawerOpen}
          onSetDrawerClick={onSetDrawerClick}
          onDrawerCloseClick={onDrawerCloseClick} />
        <BumpsChartControls incrementYear={() => onIncrementYearClick(results.endYear)} decrementYear={() => onDecrementYearClick(results.startYear)} url={window.location.toString()} />
        <BumpsChartContainer
          data={results}
          year={year}
          selectedCrews={selectedCrews}
          toggleSelectedCrew={(crew) => toggleSelectedCrew(crew, set, gender, selectedCrews)}
          focus={false}
          />
      </div >
    </MuiThemeProvider >
  );
}

App.propTypes = {
  set: React.PropTypes.string,
  gender: React.PropTypes.string,
  selectedCrews: React.PropTypes.object,
  onIncrementYearClick: React.PropTypes.func,
  onDecrementYearClick: React.PropTypes.func,
  onDrawerToggleClick: React.PropTypes.func,
  drawerOpen: React.PropTypes.bool,
  onSetDrawerClick: React.PropTypes.func,
  onDrawerCloseClick: React.PropTypes.func,
  highlightedCrew: React.PropTypes.string,
  onHighlightCrew: React.PropTypes.func
};

export default App;