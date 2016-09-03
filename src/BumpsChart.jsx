import React from 'react';
import {bumpsChart} from 'd3-bumps-chart';

export default class BumpsChart extends React.Component {
  componentDidMount() {
    this.chart = bumpsChart();
    this.svg = this.chart.setup(this.refs.bumpsChart);
    this.chart.update(this.props, this.svg);
  }

  componentDidUpdate() {
    this.chart.update(this.props, this.svg);
  }

  render() {
    const divStyle = {
      width: this.props.windowWidth,
      height: this.props.maxHeight > 0 ? this.props.maxHeight : '100%',
      border: this.props.border ? '1px solid rgba(15,70,100,.12)' : '',
      overflowY: 'auto',
    };

    return (
      <div className="bumpsChart" ref="bumpsChart" style={divStyle}>
        <svg width="100%" preserveAspectRatio="xMidYMin">
        </svg>
      </div>
    );
  }
}

BumpsChart.propTypes = {
  data: React.PropTypes.object,
  year: React.PropTypes.object,
  selectedCrews: React.PropTypes.object,
  highlightedCrew: React.PropTypes.string,
  addSelectedCrew: React.PropTypes.func,
  removeSelectedCrew: React.PropTypes.func,
  highlightCrew: React.PropTypes.func,
  maxWidth: React.PropTypes.number,
  maxHeight: React.PropTypes.number,
  border: React.PropTypes.bool,
  focus: React.PropTypes.bool,
  windowWidth: React.PropTypes.number,
};
