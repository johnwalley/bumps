import React from 'react';
import MediaQuery from 'react-responsive';
import FlatButton from 'material-ui/FlatButton';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import SelectField from 'material-ui/SelectField';
import { expandCrew } from 'd3-bumps-chart';

const styles = {
  setSelectStyle: {
    width: 146,
    fontSize: '14px',
  },
  genderSelectStyle: {
    width: 100,
    fontSize: '14px',
  },
  clubSelectStyle: {
    fontSize: '14px',
  },
};

const EventControls = ({set, gender, clubs, clubSelectMenuOpen, clubSelectMenuAnchorElement,
  onSetClick, onGenderClick, onUpdateClub, onClubSelectOpenClick, onClubSelectRequestClose}) =>
  <div style={{ display: 'flex' }}>
    <SelectField value={set} onChange={(event, index, set) => onSetClick(set)} style={styles.setSelectStyle}>
      <MenuItem value="May Bumps" primaryText="May Bumps" />
      <MenuItem value="Town Bumps" primaryText="Town Bumps" />
      <MenuItem value="Lent Bumps" primaryText="Lent Bumps" />
      <MenuItem value="Torpids" primaryText="Torpids" />
      <MenuItem value="Summer Eights" primaryText="Summer Eights" />
    </SelectField>
    <SelectField value={gender} onChange={(event, index, gender) => onGenderClick(gender)} style={styles.genderSelectStyle}>
      <MenuItem value="Women" primaryText="Women" />
      <MenuItem value="Men" primaryText="Men" />
    </SelectField>
    <MediaQuery minWidth={780}>
      <FlatButton
        onTouchTap={(event) => onClubSelectOpenClick(event)}
        label="Highlight Club"
        backgroundColor="#91B9A4"
        labelStyle={styles.clubSelectStyle}
        style={{ padding: '6px 0px 0px 0px' }}
        />
      <Popover
        open={clubSelectMenuOpen}
        anchorEl={clubSelectMenuAnchorElement}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
        onRequestClose={() => onClubSelectRequestClose()}
        >
        <Menu onItemTouchTap={(event, menuItem, index) => onUpdateClub(index)} >
          {clubs !== null ? clubs.map(club => (
            <MenuItem primaryText={expandCrew(club, set)} />
          )) : null}
        </Menu>
      </Popover>
    </MediaQuery>
  </div>;

EventControls.propTypes = {
  set: React.PropTypes.string,
  gender: React.PropTypes.string,
  onSetClick: React.PropTypes.func,
  onGenderClick: React.PropTypes.func,
};

export default EventControls;
