import React, { Component } from 'react';

class HeaderBigIcon extends Component {

	render() {
		
		var tooltipButton = {
			border: '2px solid transparent',
	    borderRadius: 4,
	    width: 45,
	    height: 45,
	    //line-height: 43,
	    //display: 'block',
	    textAlign: 'center',
	    position: 'relative',
	    background: 'rgba(255,255,255,.05)',
	    color: 'rgba(255,255,255,.7)',
	    borderColor: 'rgba(255,255,255,.2)'
		}

		var faName = this.props.faName+' fa-2x';
		
		return (
				  <a href="#" data-placement="bottom" style={tooltipButton} title={this.props.title} data-original-title={this.props.title}>
				  <i className={faName} aria-hidden="true"></i>
		      </a>
		);
	}
}

export default HeaderBigIcon;
