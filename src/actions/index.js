export const requestResults = () => ({
  type: 'REQUEST_RESULTS',
});

export const receiveResults = results => ({
  type: 'RECEIVE_RESULTS',
  results: results,
});

export function fetchResults(subreddit) {
  return function(dispatch) {
    dispatch(requestResults());
    return fetch(
      `https://3d9t1ahljg.execute-api.eu-west-2.amazonaws.com/test/results`
    )
      .then(
        response => response.json(),
        error => console.log('An error occured.', error)
      )
      .then(json => dispatch(receiveResults(json)));
  };
}

export const setYear = (start, end) => ({
  type: 'SET_YEAR',
  start,
  end,
});

export const resize = width => ({
  type: 'RESIZE',
  width,
});

export const keydown = keyCode => ({
  type: 'KEYDOWN',
  keyCode,
});

export const incrementYear = () => ({
  type: 'INCREMENT_YEAR',
});

export const decrementYear = () => ({
  type: 'DECREMENT_YEAR',
});

export const toggleDrawer = () => ({
  type: 'TOGGLE_DRAWER',
});

export const closeDrawer = () => ({
  type: 'CLOSE_DRAWER',
});

export const setDrawer = open => ({
  type: 'SET_DRAWER',
  open,
});

export const clubSelectMenuOpen = event => ({
  type: 'OPEN_CLUB_SELECT_MENU',
  event,
});

export const clubSelectMenuClose = () => ({
  type: 'CLOSE_CLUB_SELECT_MENU',
});
