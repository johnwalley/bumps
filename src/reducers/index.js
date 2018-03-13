import { combineReducers } from 'redux';

import ui from './ui';

const bumpsApp = combineReducers({
  ui,
});

export default bumpsApp;
