import React, {Component} from 'react';
import {Icon} from 'semantic-ui-react';

export default class EditUserRenderer extends Component {
    state = {};


    render() {
        let st = this.state;
        let props = this.props;
        var disable = false;
        if (props.data) {
            if (props.data.constituencyId == -1) {
                disable = true;
            }
            else {
                disable = false;
            }

        }
        if (props && props.node && props.node.group) {
            return (
                <div>
                    <Icon name="edit" size="large"
                          style={{marginLeft: 20, fontSize: '25px', cursor: 'pointer'}}/>
                </div>
            );
        }
        else {
            return (
                <div>
                    <Icon disabled={disable} name="trash" size="large"
                          style={{marginLeft: 20, fontSize: '25px', cursor: 'pointer'}}/>
                </div>
            );
        }
    }
}