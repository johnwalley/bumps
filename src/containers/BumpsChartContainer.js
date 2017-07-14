import { connect } from 'react-redux';
import { resize, setHighlightedCrew, setYear } from '../actions';

import BumpsChart from '../components/BumpsChart.jsx';

const mapStateToProps = state => ({
  highlightedCrew: state.ui.highlightedCrew
});

const mapDispatchToProps = ({
  highlightCrew: setHighlightedCrew,
  selectYear: setYear,
  resize: resize
});

const BumpsChartContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(BumpsChart);

export default BumpsChartContainer;

