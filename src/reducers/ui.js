const leftArrowKeyCode = 37;
const rightArrowKeyCode = 39;

const ui = (state = { events: null, width: null, year: null, highlightedCrew: null, drawerOpen: false, clubSelectMeuOpen: false, clubSelectMenuAnchorElement: null }, action) => {
  let year;
  switch (action.type) {
    case 'SET_YEAR':
      return {
        ...state,
        year: { start: action.start, end: action.end }
      };
    case 'RESIZE':
      return {
        ...state,
        width: action.width
      };
    case 'KEYDOWN':
      if (action.keyCode === rightArrowKeyCode) {
        year = { start: state.year.start + 1, end: state.year.end + 1 };
      } else if (action.keyCode === leftArrowKeyCode) {
        year = { start: state.year.start - 1, end: state.year.end - 1 };
      } else {
        year = { start: state.year.start, end: state.year.end };
      }

      return {
        ...state,
        year
      };
    case 'SWIPE':
      if (action.deltaX < 0) {
        year = { start: state.year.start + 1, end: state.year.end + 1 };
      } else {
        year = { start: state.year.start - 1, end: state.year.end - 1 };
      }

      return {
        ...state,
        year
      };
    case 'INCREMENT_YEAR':
      year = { start: state.year.start + 1, end: state.year.end + 1 };

      return {
        ...state,
        year
      };
    case 'DECREMENT_YEAR':
      year = { start: state.year.start - 1, end: state.year.end - 1 };

      return {
        ...state,
        year
      };
    case 'SET_HIGHLIGHTED_CREW':
      return {
        ...state,
        highlightedCrew: action.crew
      };
    case 'TOGGLE_DRAWER':
      return {
        ...state,
        drawerOpen: !state.drawerOpen
      };
    case 'CLOSE_DRAWER':
      return {
        ...state,
        drawerOpen: false
      };
    case 'SET_DRAWER':
      return {
        ...state,
        drawerOpen: action.open
      };
    case 'OPEN_CLUB_SELECT_MENU':
      action.event.preventDefault();

      return {
        ...state,
        clubSelectMenuOpen: true,
        clubSelectMenuAnchorElement: action.event.currentTarget
      };
    case 'CLOSE_CLUB_SELECT_MENU':
      return {
        ...state,
        clubSelectMenuOpen: false
      };
    default:
      return state;
  }
};

export default ui;
