import React from 'react';
import { select } from 'd3-selection';
import 'd3-transition';
import { bumpsChart } from 'd3-bumps-chart';

export default class BumpsChart extends React.Component {
  componentDidMount() {
    this.chart = bumpsChart()
      .year(this.props.year)
      .windowWidth(this.props.windowWidth)
      .selectedCrews(this.props.selectedCrews)
      .on('selectYear', this.props.selectYear)
      .on('toggleSelectedCrew', this.props.toggleSelectedCrew);

    select(this.bumpsChart)
      .datum(this.props.data)
      .call(this.chart);

    this.props.resize(window.document.body.clientWidth);
  }

  componentDidUpdate() {
    this.chart
      .year(this.props.year)
      .windowWidth(this.props.windowWidth)
      .selectedCrews(this.props.selectedCrews);

    select(this.bumpsChart)
      .datum(this.props.data)
      .call(this.chart);
  }

  render() {
    const divStyle = {
      width: this.props.windowWidth > 0 ? this.props.windowWidth : '100%',
      height: this.props.maxHeight > 0 ? this.props.maxHeight : '100%',
      border: this.props.border ? '1px solid rgba(15,70,100,.12)' : '',
      overflowY: 'auto',
    };

    return (
      <div
        className="bumpsChart"
        ref={chart => {
          this.bumpsChart = chart;
        }}
        style={divStyle}
      >
        <svg width="100%" preserveAspectRatio="xMidYMin" />
      </div>
    );
  }
}
