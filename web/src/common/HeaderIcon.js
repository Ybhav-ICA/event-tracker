import React, { Component } from 'react';
import './HeaderIcon.css';

class HeaderIcon extends Component {

	render() {
		
		
		
		var hdrButton = {
	    float: this.props.float?this.props.float:'left',
	    height: 25,
	    display: 'block',
	    width: 28,
	    textAlign: 'center',
	    background: 'rgba(255,255,255,.05)',
	    borderRadius: 3,
	    margin: '8px 10px 0 0',
	    color: 'rgba(255,255,255,.7)',
	    paddingTop: 5
		}
		
		return (
					<a href="#" title={this.props.title} style={hdrButton} className="hdr-btn">
						<i className={this.props.faName} aria-hidden="true"></i>
				  </a>
		);
	}
}

export default HeaderIcon;
