import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import AppContainer from './containers/AppContainer';
import { resize, keydown } from './actions';
import reducer from './reducers'
import events from '../results/generated.json';

const initialState = {
  ui: {
    events,
    year: { start: 2016, end: 2016 },
    width: window.document.body.clientWidth
  }
};

const store = createStore(reducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

window.addEventListener('resize', () => {
    store.dispatch(resize(window.document.body.clientWidth));
});

window.addEventListener('keydown', (event) => {
    store.dispatch(keydown(event.keyCode));
});

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={AppContainer} />
      <Route path=":eventId" component={AppContainer} />
      <Route path=":eventId/:genderId" component={AppContainer} />
      <Route path=":eventId/:genderId/:crewId" component={AppContainer} />
    </Router>
  </Provider>,
  document.getElementById('content')
);
