import { browserHistory } from 'react-router';

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
