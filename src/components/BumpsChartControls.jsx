import React from 'react';
import IconButton from 'material-ui/IconButton';
import AVFastForward from 'material-ui/svg-icons/av/fast-forward';
import AVFastRewind from 'material-ui/svg-icons/av/fast-rewind';
import { ShareButtons, generateShareIcon } from 'react-share';

const { FacebookShareButton, TwitterShareButton } = ShareButtons;

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

const facebookTitle = 'Share these results';
const twitterTitle = 'Check out these Cambridge Bumps results!';

const BumpsChartControls = ({ incrementYear, decrementYear, url }) => (
  <div className="bumpsControls" style={styles.customButtons}>
    <IconButton onClick={decrementYear}>
      <AVFastRewind color="#91B9A4" />
    </IconButton>
    <div className="share">
      <FacebookShareButton
        url={url}
        quote={facebookTitle}
        className="facebook-share-button"
      >
        <FacebookIcon size={24} round />
      </FacebookShareButton>
      <TwitterShareButton
        url={url}
        title={twitterTitle}
        className="twitter-share-button"
      >
        <TwitterIcon size={24} round />
      </TwitterShareButton>
    </div>
    <IconButton onClick={incrementYear}>
      <AVFastForward color="#91B9A4" />
    </IconButton>
  </div>
);

BumpsChartControls.propTypes = {
  incrementYear: React.PropTypes.func,
  decrementYear: React.PropTypes.func,
  url: React.PropTypes.string,
};

export default BumpsChartControls;
