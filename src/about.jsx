import React from 'react';
import ReactDOM from 'react-dom';

export default class About extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>How do Bumps work?</h1>
        <p>The River Cam is an awful place to hold a rowing event. It is narrow and winding.</p>
        <p>Bumps racing began in the 1820s as a way to allow large numbers of boats to compete against one another.</p>

        
        <p>
        Bumps racing evolved in the 1820s
        </p>
        They allow a large number of colleges to compete on a river not suitable for more conventional regattas
        The races take place tweice a year in the form of Lent Bumps and May Bumps
        In the Lent Bumps, the boats are split into 7 divisions; in May Bumps, 10 divisions
        Each division has 17-18 boats
        The object of the race is to catchup with and bump the crew in front of you
        Crews start 90 feeet apart
        Crews that bump each other pull over to allow the rest of the division to continue
        Willow branches are given to the boats who have bumped other boats
        The winner of the race is largely based on the starting order of the boats
        The finishing order for crews for one race decides the order for the next race
        A crew that bumps another boat gains their starting spot in the next race, rising in their division
        Crews that win their division get to race at the bottom of the next divsion
        The goal is to finish as the first boat in the first division
        However, if a crew manages to bumps a boat each day, they are awarded a special blade
        ...painted in their college colors with their crew's names and the boats they bumped
        Spectators can watch from the pub or the towpath
        
        <iframe width="560" height="315" src="https://www.youtube.com/embed/hYwnppXx7Q0" frameborder="0" allowfullscreen></iframe>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/mkt5wEEI-zw" frameborder="0" allowfullscreen></iframe>
      </div>
    )
  }
}
