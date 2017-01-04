import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import AppContainer from './containers/AppContainer';
import reducer from './reducers'

import { joinEvents, transformData, calculateYearRange, expandCrew } from 'd3-bumps-chart';

import events from '../results/generated.json';

function pickEvents(events, gender, set, yearRange = [-Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]) {
  const transformedEvents = events
    .filter(e => e.gender.toLowerCase() === gender.toLowerCase())
    .filter(e => e.set === set)
    .filter(e => e.year >= yearRange[0] && e.year <= yearRange[1])
    .sort((a, b) => a.year - b.year)
    .map(event => transformData(event));

  return joinEvents(transformedEvents, set, gender);
}

function calculateNumYearsToview() {
  const width = window.innerWidth;
  const widthOfOneYear = 80;
  const widthWithoutLines = 310;

  return Math.max(0, Math.ceil((width - widthWithoutLines) / widthOfOneYear));
}

const initialState = {
  ui: {
    events,
    year: { start: 2016, end: 2016 }
  }
};

const store = createStore(reducer, initialState);

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
