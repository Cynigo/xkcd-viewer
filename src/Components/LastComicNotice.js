import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './LastComicNotice.css';

class LastComicNotice extends Component {

  render() {
    if (
      !this.props.lastVisitComicID || 
      (+this.props.lastVisitComicID !== 0 && +this.props.lastVisitComicID === +this.props.currentComicID)
    ) return null;

    return (
      <div 
        id="notice"
        onClick={this.props.onClick}>
        <strong>{`Go back to ${this.props.lastVisitComicID}`}</strong>
      </div>
    );
  }
}

LastComicNotice.propTypes = {
  onClick: PropTypes.func.isRequired,
  lastVisitComicID: PropTypes.string,
  currentComicID: PropTypes.string,
};

export default LastComicNotice;
