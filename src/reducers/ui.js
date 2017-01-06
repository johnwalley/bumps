const ui = (state = { events: null, width: null, year: null, highlightedCrew: null, drawerOpen: false, clubSelectMeuOpen: false, clubSelectMenuAnchorElement: null }, action) => {
  let year;
  switch (action.type) {
    case 'RESIZE':
      return {
        ...state,
        width: action.width
      }
    // FIXME: Needs a strategy for handling year extent as state
    case 'KEYDOWN':
      year = state.year;

      if (action.keyCode === 39) {
        if (state.year.end < action.max) {
          year = { start: state.year.start + 1, end: state.year.end + 1 };
        }
      } else if (action.keyCode === 37) {
        if (state.year.start > action.min) {
          year = { start: state.year.start - 1, end: state.year.end - 1 };
        }
      }

      return {
        ...state,
        year
      }
    case 'SWIPE':
      year = state.year;

      if (action.deltaX < 0) {
        if (state.year.end < action.max) {
          year = { start: state.year.start + 1, end: state.year.end + 1 };
        }
      } else {
        if (state.year.start > action.min) {
          year = { start: state.year.start - 1, end: state.year.end - 1 };
        }
      }

      return {
        ...state,
        year
      }
    case 'INCREMENT_YEAR':
      year = state.year;

      if (state.year.end < action.max) {
        year = { start: state.year.start + 1, end: state.year.end + 1 };
      }

      return {
        ...state,
        year
      }
    case 'DECREMENT_YEAR':
      year = state.year;

      if (state.year.start > action.min) {
        year = { start: state.year.start - 1, end: state.year.end - 1 };
      }

      return {
        ...state,
        year
      }
    case 'SET_HIGHLIGHTED_CREW':
      return {
        ...state,
        highlightedCrew: action.crew
      }
    case 'TOGGLE_DRAWER':
      return {
        ...state,
        drawerOpen: !state.drawerOpen
      }
    case 'CLOSE_DRAWER':
      return {
        ...state,
        drawerOpen: false
      }
    case 'SET_DRAWER':
      return {
        ...state,
        drawerOpen: action.open
      }
    case 'OPEN_CLUB_SELECT_MENU':
      action.event.preventDefault();

      return {
        ...state,
        clubSelectMenuOpen: true,
        clubSelectMenuAnchorElement: action.event.currentTarget
      }
    case 'CLOSE_CLUB_SELECT_MENU':
      return {
        ...state,
        clubSelectMenuOpen: false
      }
    default:
      return state
  }
}

export default ui;
