import { browserHistory } from 'react-router';
import { joinEvents, transformData } from 'd3-bumps-chart';

export const pickEvents = (events, gender, set, yearRange = [-Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]) => {
  const transformedEvents = events
    .filter(e => e.gender.toLowerCase() === gender.toLowerCase())
    .filter(e => e.set === set)
    .filter(e => e.year >= yearRange[0] && e.year <= yearRange[1])
    .sort((a, b) => a.year - b.year)
    .map(event => transformData(event));

  return joinEvents(transformedEvents, set, gender);
}

export const setUrl = (set, gender, selectedCrews) => {
  const setMapInverse = {
    'May Bumps': 'mays',
    'Lent Bumps': 'lents',
    'Town Bumps': 'town',
    'Torpids': 'torpids',
    'Summer Eights': 'eights',
  };

  if (selectedCrews.size > 0) {
    browserHistory.push(`/${setMapInverse[set]}/${gender.toLowerCase()}/${[...selectedCrews].map(crew => crew.replace(/ /g, '_').replace(/\//g, '-')).join(',')}`);
  } else {
    browserHistory.push(`/${setMapInverse[set]}/${gender.toLowerCase()}`);
  }
};
