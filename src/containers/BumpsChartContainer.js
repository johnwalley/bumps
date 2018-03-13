import { connect } from 'react-redux';
import { resize, setYear } from '../actions';

import BumpsChart from '../components/BumpsChart.jsx';

const mapDispatchToProps = {
  selectYear: setYear,
  resize: resize,
};

const BumpsChartContainer = connect(null, mapDispatchToProps)(BumpsChart);

export default BumpsChartContainer;
