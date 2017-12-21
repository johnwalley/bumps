import React from 'react';
import Media from 'react-media';
import FlatButton from 'material-ui/FlatButton';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import SelectField from 'material-ui/SelectField';
import { expandCrew } from 'd3-bumps-chart';
import { color } from '../util';

const styles = {
  setSelectStyle: {
    width: 146,
    fontSize: '14px',
  },
  genderSelectStyle: {
    width: 104,
    fontSize: '14px',
  },
  clubSelectStyle: {
    fontSize: '14px',
  },
};

const EventControls = ({
  set,
  gender,
  clubs,
  clubSelectMenuOpen,
  clubSelectMenuAnchorElement,
  onSetClick,
  onGenderClick,
  onUpdateClub,
  onClubSelectOpenClick,
  onClubSelectRequestClose,
}) => (
  <div style={{ display: 'flex' }}>
    <SelectField
      value={set}
      onChange={(event, index, set) => onSetClick(set)}
      style={styles.setSelectStyle}
    >
      <MenuItem value="Lent Bumps" primaryText="Lent Bumps" />
      <MenuItem value="May Bumps" primaryText="May Bumps" />
      <MenuItem value="Summer Eights" primaryText="Summer Eights" />
      <MenuItem value="Torpids" primaryText="Torpids" />
      <MenuItem value="Town Bumps" primaryText="Town Bumps" />
    </SelectField>
    <SelectField
      value={gender}
      onChange={(event, index, gender) => onGenderClick(gender)}
      style={styles.genderSelectStyle}
    >
      <MenuItem value="Women" primaryText="Women" />
      <MenuItem value="Men" primaryText="Men" />
    </SelectField>
    <Media
      query={{ minWidth: 780 }}
      render={() => (
        <div>
          <FlatButton
            onTouchTap={event => onClubSelectOpenClick(event)}
            label="Highlight Club"
            backgroundColor={color.cambridgeBlue}
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
            <Menu onItemClick={(event, menuItem, index) => onUpdateClub(index)}>
              {clubs !== null
                ? clubs.map(club => (
                    <MenuItem
                      primaryText={expandCrew(club, set)}
                      key={expandCrew(club, set)}
                    />
                  ))
                : null}
            </Menu>
          </Popover>
        </div>
      )}
    />
  </div>
);

export default EventControls;
