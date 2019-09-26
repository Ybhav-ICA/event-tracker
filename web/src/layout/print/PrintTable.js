import React, {Component} from 'react';
import {Table} from 'semantic-ui-react';
import './print.css';
import SMAUtils from "../../common/SMAUtils";

export default class PrintTable extends Component {

    render() {
        const {event, data} = this.props;

        var _event = {};
        var date = {};
        if (event) {
            _event = event;
            date = SMAUtils.getDateTime(event.date);
        }

        var rows = [];
        if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                const row = data[i];
                var columns = [
                    <Table.Cell key={'question' + i} width={5} style={{fontWeight: 600}}>
                        {row.question}
                    </Table.Cell>,
                    <Table.Cell key={'option' + i}>
                        <p>{row.option}</p>
                    </Table.Cell>
                ];

                rows.push(
                    <Table.Row>
                        {columns}
                    </Table.Row>
                );
            }
        }

        return (
            <div className='print-table'>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-6'>
                            <label>Event Name: </label> {_event.eventName}
                        </div>
                        <div className='col-6'>
                            <label>Date: </label> {date.date} {date.time}
                        </div>
                    </div>
                    <div className='row' style={{paddingTop: 15}}>
                        <div className='col-6'>
                            <label>Parliament: </label> {_event.parliament}
                        </div>
                        <div className='col-6'>
                            <label>State: </label> {_event.state}
                        </div>
                    </div>
                </div>
                <Table celled>
                    <Table.Body>
                        {rows}
                    </Table.Body>
                </Table>
            </div>
        );
    }
}