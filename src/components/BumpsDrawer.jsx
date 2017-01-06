import React from 'react';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Help from 'material-ui/svg-icons/action/help';
import Error from 'material-ui/svg-icons/alert/error';
import Create from 'material-ui/svg-icons/content/create';

const BumpsDrawer = ({drawerOpen, onSetDrawerClick, onDrawerCloseClick}) =>
  <Drawer
    docked={false}
    width={240}
    open={drawerOpen}
    onRequestChange={(open) => onSetDrawerClick(open)}
    >
    <h2 style={{ paddingLeft: '12px' }}>Cambridge Bumps</h2>
    <MenuItem leftIcon={<Help />} onTouchTap={() => onDrawerCloseClick()}><a href="http://www.cucbc.org/bumps/how_bumps_work">How bumps work</a></MenuItem>
    <Divider />
    <MenuItem leftIcon={<Error />} onTouchTap={() => onDrawerCloseClick()}><a href="mailto:john@walley.org.uk?subject=I've%20spotted%20an%20error%20on%20Cambridge%20Bumps">Spotted an error?</a></MenuItem>
    <MenuItem leftIcon={<Create />} onTouchTap={() => onDrawerCloseClick()}><a href="mailto:john@walley.org.uk?subject=I've%20got%20a%20great%20idea">Suggest a feature!</a></MenuItem>
  </Drawer>;

BumpsDrawer.propTypes = {
  drawerOpen: React.PropTypes.bool,
  onSetDrawerClick: React.PropTypes.func,
  onDrawerCloseClick: React.PropTypes.func,
};

export default BumpsDrawer;
