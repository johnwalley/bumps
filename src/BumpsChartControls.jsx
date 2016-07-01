import React from 'react';
import IconButton from 'material-ui/IconButton';
import AVFastForward from 'material-ui/svg-icons/av/fast-forward';
import AVFastRewind from 'material-ui/svg-icons/av/fast-rewind';

import {
    ShareButtons,
    generateShareIcon,
} from 'react-share';

const {
    FacebookShareButton,
    TwitterShareButton,
} = ShareButtons;

const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');

const styles = {
  customButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    display: 'flex',
  },
  customFlatButton: {
    color: '#91B9A4',
  },
};

const facebookShareUrl = 'http://www.cambridgebumps.com/';
const twitterShareUrl = 'http://www.cambridgebumps.com/';

const title = 'Share these results';
const twitterTitle = 'Check out these Cambridge Bumps results!';

export default class BumpsChartControls extends React.Component {
  constructor(props) {
    super(props);

    this.incrementYear = this.incrementYear.bind(this);
    this.decrementYear = this.decrementYear.bind(this);
  }

  incrementYear() {
    this.props.incrementYear();
  }

  decrementYear() {
    this.props.decrementYear();
  }

  render() {
    return (
      <div className="bumpsControls" style={styles.customButtons}>
        <IconButton onClick={this.decrementYear}>
          <AVFastRewind color="#91B9A4" />
        </IconButton>
        <div className="share">
          <FacebookShareButton
            url={facebookShareUrl}
            title={title}
            className="facebook-share-button"
          >
            <FacebookIcon
              size={24}
              round
            />
          </FacebookShareButton>
          <TwitterShareButton
            url={twitterShareUrl}
            title={twitterTitle}
            className="twitter-share-button"
          >
            <TwitterIcon
              size={24}
              round
            />
          </TwitterShareButton>
        </div>
        <IconButton onClick={this.incrementYear}>
          <AVFastForward color="#91B9A4" />
        </IconButton>
      </div>
    );
  }
}

BumpsChartControls.propTypes = {
  incrementYear: React.PropTypes.func,
  decrementYear: React.PropTypes.func,
};
