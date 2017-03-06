import { createSelector } from 'reselect';
import { pickEvents, setMap } from '../util';
import { calculateNumYearsToview } from 'd3-bumps-chart';

const getEvents = state => state.ui.events;

export const getSet = (state, props) => {
  let set = 'Lent Bumps';

  if (props.params.eventId !== undefined) {
    const paramSet = props.params.eventId.toLowerCase();

    if (paramSet in setMap) {
      set = setMap[paramSet];
    }
  }

  return set;
};

export const getGender = (state, props) => {
  const genderMap = {
    women: 'Women',
    men: 'Men',
  };

  let gender = 'Women';

  if (props.params.genderId !== undefined) {
    const paramGender = props.params.genderId.toLowerCase();

    if (paramGender in genderMap) {
      gender = genderMap[paramGender];
    }
  }

  return gender;
};

export const getSelectedCrews = (state, props) => {
  let selectedCrews = new Set();

  if (props.params.crewId !== undefined) {
    selectedCrews = new Set(props.params.crewId.split(',').map(crew => crew.replace(/_/g, ' ').replace(/-/g, '/')));
  }

  return selectedCrews;
};

export const getResults = createSelector(
  [getEvents, getSet, getGender],
  (events, set, gender) => pickEvents(events, gender, set)
);

export const getClubs = (state, props) => {
  let numClubs = 8;
  const numYears = calculateNumYearsToview(state.ui.width);

  const fullData = getResults(state, props);
  const restrictedData = pickEvents(state.ui.events, getGender(state, props), getSet(state, props), [fullData.endYear - numYears, fullData.endYear]);

  const rawClubs = restrictedData.crews.map(crew => crew.name.replace(/[0-9]+$/, '').trim());
  const uniqueClubs = new Set(restrictedData.crews.map(crew => crew.name.replace(/[0-9]+$/, '').trim()));
  const histogram = [...uniqueClubs.values()].map(club => ({ club, count: rawClubs.filter(c => c === club).length }));
  const sortedHistogram = histogram.sort((a, b) => b.count - a.count);

  if (props.params.set !== 'Town Bumps') {
    numClubs = sortedHistogram.length;
  }

  const topNClubs = sortedHistogram.slice(0, numClubs).map(c => c.club);

  return topNClubs.sort((a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });
};

export const getYear = state => state.ui.year;
