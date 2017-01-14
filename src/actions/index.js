export const setYear = (start, end) => ({
  type: 'SET_YEAR',
  start,
  end
});

export const resize = width => ({
  type: 'RESIZE',
  width
});

export const keydown = keyCode => ({
  type: 'KEYDOWN',
  keyCode
});

export const swipe = deltaX => ({
  type: 'SWIPE',
  deltaX
});

export const incrementYear = () => ({
  type: 'INCREMENT_YEAR'
});

export const decrementYear = () => ({
  type: 'DECREMENT_YEAR'
});

export const setHighlightedCrew = crew => ({
  type: 'SET_HIGHLIGHTED_CREW',
  crew
});

export const toggleDrawer = () => ({
  type: 'TOGGLE_DRAWER'
});

export const closeDrawer = () => ({
  type: 'CLOSE_DRAWER'
});

export const setDrawer = open => ({
  type: 'SET_DRAWER',
  open
});

export const clubSelectMenuOpen = event => ({
  type: 'OPEN_CLUB_SELECT_MENU',
  event
});

export const clubSelectMenuClose = () => ({
  type: 'CLOSE_CLUB_SELECT_MENU',
});
