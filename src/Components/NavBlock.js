import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './NavBlock.css';

class NavBlock extends Component {

  render() {
    return (
			<div 
				id={this.props.id}
				onClick={this.props.onClick}
				className='navBlock'
			/>
    );
  }
}

NavBlock.propTypes = {
	onClick: PropTypes.func.isRequired,
	id: PropTypes.string.isRequired,
};

export default NavBlock;
