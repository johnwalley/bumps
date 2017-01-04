import React from 'react';

import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

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

const EventControls = ({set, gender, onSetClick, onGenderClick}) =>
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
  </div>;

EventControls.propTypes = {
  set: React.PropTypes.string,
  gender: React.PropTypes.string,
  onSetClick: React.PropTypes.func,
  onGenderClick: React.PropTypes.func,
};

export default EventControls;
