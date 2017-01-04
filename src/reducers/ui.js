const ui = (state = { events: null, year: null, highlightedCrew: null, drawerOpen: false }, action) => {
  let year;
  switch (action.type) {
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
    default:
      return state
  }
}

export default ui;
