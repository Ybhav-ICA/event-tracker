import React, { Component } from 'react';
import './Panel.css';

class Panel extends Component {

	render() {
		
		return (
				
		<div className="panel" style={this.props.style_}>
      <div className="panel-body">
        <h3 className="title-hero" style={this.props.titleStyle_}>
            {this.props.title}
        </h3>
        <div className="content-wrapper">
            <div id="content-div" style={{width: '100%', height: '100%', padding:0, position: 'relative'}}>
            	{this.props.children}
            </div>
        </div>
      </div>
    </div>
				
		);
	}
}

export default Panel;
