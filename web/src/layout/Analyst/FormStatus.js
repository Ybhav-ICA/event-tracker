import React, {Component} from 'react';
import './Analyst.css';
import {Icon} from 'semantic-ui-react';
import _ from 'underscore';

export default class FormStatus extends Component {

    render() {
        var {data} = this.props;

        var formStatuses = [];
        if (data && data.length > 0) {
            data = _.sortBy(data, 'id');

            for (var i = 0; i < data.length; i++) {
                const form = data[i];
                var status = '';
                if (form.formStatus === 'P') {
                    status = <Icon name='close' color='red'/>;
                }
                else if (form.formStatus === 'C') {
                    status = <Icon name='check' color='green'/>;
                }
                formStatuses.push(
                    <div key={i} style={{paddingBottom: 3,display:'flex'}}>
                        <span style={{flex:1, paddingRight: 40}}>{form.formName} </span>
                        <span>{status}</span>
                    </div>
                );
            }
        }

        return (
            <div className='col-dir'>
                {formStatuses}
            </div>
        );
    }
}
