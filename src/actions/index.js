export const incrementYear = (max) => ({
  type: 'INCREMENT_YEAR',
  max
});

export const decrementYear = (min) => ({
  type: 'DECREMENT_YEAR',
  min
});

export const setHighlightedCrew = (crew) => ({
  type: 'SET_HIGHLIGHTED_CREW',
  crew
});

export const toggleDrawer = () => ({
  type: 'TOGGLE_DRAWER'
});

export const closeDrawer = () => ({
  type: 'CLOSE_DRAWER'
});

export const setDrawer = (open) => ({
  type: 'SET_DRAWER',
  open
});
