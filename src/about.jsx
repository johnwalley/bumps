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
        <p>The River Cam is an awful place to hold a rowing event. Narrow and winding, it's simply not possible to stage a conventional side-by-side regatta; so Bumps racing evolved in the 1820s to let large numbers of boats to compete against one another.</p>
        <p>Men and women race separately. Boats are split into multiple divisions. Each division has 17-18 boats and crews start 90 feet apart.</p>
        <p>The aim of the race is to catch and 'bump' the crew in front of you. A bump is awarded if the crew in front concedes. And yes, this can require you to actually hit the boat in front! Crews that bumps one another must pull over to the side to allow the crews behind to continue.</p>
        <p>Racing takes place over four days with the finishing order at the end of a day determining the starting order for the following day. This means that a crew which bumps the crew in front will gain their starting position for the next day.</p>
        <h1>Anything else I should know?</h1>
        <p>A crew which ends up at the top of their division gets to race again at the bottom of the next division on the same day. This crew is known as the sandwich boat due to the fact that they are sandwiched between two divisions. The honour is double-edged because while you get the opportunity to go up a division you also must race twice in one day!</p>
        <p>The crew which ends the week at the top if the first division is awarded the headship, or head of the river. Due to the nature of Bumps this might not necessarily be the fastest crew but it is always a mighty achievement and well deserved.</p>
        <p>Crews which achieve a bump are given willow branches to 'wear' as they row back to their boathouses</p>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/hYwnppXx7Q0" frameborder="0" allowfullscreen></iframe>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/mkt5wEEI-zw" frameborder="0" allowfullscreen></iframe>
      </div>
    )
  }
}
