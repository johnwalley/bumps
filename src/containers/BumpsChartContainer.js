import { connect } from 'react-redux';
import { resize, setHighlightedCrew } from '../actions';

import BumpsChart from '../components/BumpsChart.jsx';

const mapStateToProps = state => ({
  highlightedCrew: state.ui.highlightedCrew
});

const mapDispatchToProps = ({
  highlightCrew: setHighlightedCrew,
  resize: resize
});

const BumpsChartContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(BumpsChart);

export default BumpsChartContainer;

