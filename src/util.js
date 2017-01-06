import { browserHistory } from 'react-router';

export const calculateNumYearsToview = (width) => {
  const widthOfOneYear = 80;
  const widthWithoutLines = 310;

  return Math.max(0, Math.ceil((width - widthWithoutLines) / widthOfOneYear));
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
    browserHistory.push(`/${setMapInverse[set]}/${gender.toLowerCase()}/${[...selectedCrews].map(crew => crew.replace(/ /g, '_')).join(',')}`);
  } else {
    browserHistory.push(`/${setMapInverse[set]}/${gender.toLowerCase()}`);
  }
}