import React from 'react';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {
  calculateNumYearsToview,
  calculateYearRange,
  expandCrew,
} from 'd3-bumps-chart';

import { setUrl, setMapInverse, color } from '../util';
import BumpsChartContainer from '../containers/BumpsChartContainer';
import EventControls from './EventControls.jsx';
import BumpsDrawer from './BumpsDrawer.jsx';
import BumpsChartControls from './BumpsChartControls.jsx';

injectTapEventPlugin();

const muiTheme = getMuiTheme(darkBaseTheme, {
  palette: {
    accent1Color: color.cambridgeBlue,
  },
  appBar: {
    color: '#FFFFFF',
    textColor: '#FFFFFF',
  },
  button: {
    textTransform: 'capitalize',
  },
});

const styles = {
  customToolbar: {
    backgroundColor: color.cambridgeBlue,
    textColor: '#FFFFFF',
  },
};

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

function matchCrew(club, crew, set) {
  const expandedCrew = expandCrew(crew.name, set);
  const reducedCrew = expandedCrew.replace(/[0-9]+$/, '').replace(/\s+/g, '');

  return club === reducedCrew;
}

function setClub(index, clubs, set, gender, results, closeMenu) {
  const club = expandCrew(clubs[index], set);

  const selectedCrews = new Set(
    results.crews
      .filter(crew => matchCrew(club.replace(/\s+/g, ''), crew, set))
      .map(crew => crew.name)
  );

  closeMenu();

  setUrl(set, gender, selectedCrews);
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

const App = ({
  set,
  gender,
  selectedCrews,
  results,
  year,
  clubs,
  width,
  clubSelectMenuOpen,
  clubSelectMenuAnchorElement,
  onSetYear,
  onIncrementYearClick,
  onDecrementYearClick,
  onDrawerToggleClick,
  drawerOpen,
  onSetDrawerClick,
  onDrawerCloseClick,
  onClubSelectOpenClick,
  onClubSelectRequestClose,
}) => {
  const currentYear = calculateYearRange(
    year,
    { start: results.startYear, end: results.endYear },
    calculateNumYearsToview(width)
  );

  // Think of this as clamping to valid values
  if (currentYear.start !== year.start || currentYear.end !== year.end) {
    setTimeout(() => onSetYear(currentYear.start, currentYear.end));
    year = currentYear;
  }

  return (
    <MuiThemeProvider muiTheme={muiTheme}>
      <div className="bumpsContainer">
        <AppBar
          iconElementRight={
            <EventControls
              set={set}
              gender={gender}
              clubs={clubs}
              clubSelectMenuOpen={clubSelectMenuOpen}
              clubSelectMenuAnchorElement={clubSelectMenuAnchorElement}
              onSetClick={newSet => setSet(newSet, set, gender, selectedCrews)}
              onGenderClick={newGender =>
                setGender(newGender, set, gender, selectedCrews)
              }
              onUpdateClub={index =>
                setClub(
                  index,
                  clubs,
                  set,
                  gender,
                  results,
                  onClubSelectRequestClose
                )
              }
              onClubSelectOpenClick={event => onClubSelectOpenClick(event)}
              onClubSelectRequestClose={() => onClubSelectRequestClose()}
            />
          }
          onLeftIconButtonClick={() => onDrawerToggleClick()}
          style={styles.customToolbar}
        />
        <BumpsDrawer
          drawerOpen={drawerOpen}
          onSetDrawerClick={onSetDrawerClick}
          onDrawerCloseClick={onDrawerCloseClick}
        />
        <BumpsChartControls
          incrementYear={() => onIncrementYearClick()}
          decrementYear={() => onDecrementYearClick()}
          url={window.location.toString()}
        />
        <BumpsChartContainer
          data={results}
          year={year}
          selectedCrews={selectedCrews}
          toggleSelectedCrew={crew =>
            toggleSelectedCrew(crew, set, gender, selectedCrews)
          }
          focus={false}
          windowWidth={width}
        />
      </div>
    </MuiThemeProvider>
  );
};

export default App;
