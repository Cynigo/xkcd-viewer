import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Image.css';

class Image extends Component {

  render() {
    return (
      <div id='image'>
        <img 
          {...this.props}
          alt = {this.props.alt} // Compiler isn't smart enough
        />
      </div>
    );
  }
}

Image.defaultProps = {
  alt: 'image',
};

Image.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
};

export default Image;
