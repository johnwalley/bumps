import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk'

import AppContainer from './containers/AppContainer';
import About from './about.jsx';
import Statistics from './statistics.jsx';
import { resize, keydown } from './actions';
import reducer from './reducers';
import { fetchResults } from './actions';

const initialState = {
  ui: {
    events: [],
    year: { start: 2017, end: 2017 },
    width: window.document.body.clientWidth
  }
};

const store = createStore(reducer, initialState, applyMiddleware(thunkMiddleware));

store.dispatch(fetchResults());

window.addEventListener('resize', () => {
  store.dispatch(resize(window.document.body.clientWidth));
});

window.addEventListener('keydown', (event) => {
  store.dispatch(keydown(event.keyCode));
});

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="about" component={About} />
      <Route path="/" component={AppContainer} />
      <Route path=":eventId" component={AppContainer} />
      <Route path=":eventId/:genderId" component={AppContainer} />
      <Route path=":eventId/:genderId/:crewId" component={AppContainer} />
    </Router>
  </Provider>,
  document.getElementById('content')
);
