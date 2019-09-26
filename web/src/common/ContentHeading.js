import React, { Component } from 'react';

class ContentHeading extends Component {

	render() {
		
		var divStyle = {
				padding: '0 0 23px'
		}
		
		var fontStyle = {
			fontFamily: 'Raleway,"Helvetica Neue",Helvetica,Arial,sans-serif',
	    fontWeight: 300,
			fontSize: '20px',
	    textTransform: 'uppercase',
	    padding: 0,
	    margin: 0,
	    color: '#414C59'
		}
		
		var pStyle = {
			opacity: .5,
			fontFamily: 'Raleway,"Helvetica Neue",Helvetica,Arial,sans-serif',
    	fontWeight: 300,
			lineHeight: '1.6em',
    	margin: 0,
    	fontSize: 16
		}
		
		return (
				<div style={divStyle}>
					<h2 style={fontStyle}>{this.props.title}</h2>
					<p style={pStyle}>{this.props.description}</p>
				</div>
		);
	}
}

export default ContentHeading;
