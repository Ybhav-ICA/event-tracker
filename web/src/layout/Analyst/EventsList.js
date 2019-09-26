import React, {Component} from 'react';
import './Analyst.css';
import {Table, Icon, Button} from 'semantic-ui-react'
import FormStatus from "./FormStatus";
import moment from 'moment';
import _ from 'underscore';
import SMAUtils from "../../common/SMAUtils";
import MainStore from "../../MainStore";

export default class EventsList extends Component {

    state = {
        events: [],
        user: {}
    };

    componentDidMount() {
        const user = JSON.parse(sessionStorage.getItem('user'));
        this.state.user = user;
        const {events} = this.props;
        if (events) {
            this.setState({events});
        }
    }

    componentWillReceiveProps(props) {
        const {events} = props;
        if (events) {
            this.setState({events});
        }
    }

    getEventById(eventId) {
        const event = _.findWhere(this.state.events, {id: parseInt(eventId)});
        return event ? event : {};
    }

    onAddComments = (event) => {
        this.props.onAddComments(event.target.id);
    };

    onPrintClick = (event) => {
        this.props.onPrintClick(event.target.id);
    };

    onEdit = (event, data) => {
        this.props.onEdit(
            this.getEventById(data.id)
        );
    };

    onDelete = (event, data) => {
        this.props.onDelete(
            this.getEventById(data.id)
        );
    };

    onResend = (event, data) => {
        this.props.onResend(
            this.getEventById(data.id)
        );
    };

    isActionDisable(statuses) {
        const rows = _.where(statuses, {formStatus: 'C'});
        return rows && rows.length > 0;
    }

    render() {
        const {events, user} = this.state;

        var roleId = '';
        if (user && user.roleId) {
            roleId = user.roleId;
        }

        var rows = [];
        if (events && events.length > 0) {
            for (var i = 0; i < events.length; i++) {
                const event = events[i];
                var columns = [];
                const {date, time} = SMAUtils.getDateTime(event.date);

                const disableActions = this.isActionDisable(event.formStatuses);

                columns.push(<Table.Cell key={i + 'eventName'}>{event.eventName}</Table.Cell>);
                columns.push(<Table.Cell key={i + 'date'}>{date}</Table.Cell>);
                columns.push(<Table.Cell key={i + 'time'}>{time}</Table.Cell>);
                columns.push(<Table.Cell key={i + 'role'}>{event.role}</Table.Cell>);
                columns.push(<Table.Cell key={i + 'leaderName'}>{event.leaderName}</Table.Cell>);
                columns.push(<Table.Cell key={i + 'state'}>{event.state}</Table.Cell>);
                columns.push(<Table.Cell key={i + 'parliament'}>{event.parliament}</Table.Cell>);
                columns.push(
                    <Table.Cell key={i + 'assigned'}>
                        <FormStatus {...{data: event.formStatuses}}/>
                    </Table.Cell>
                );

                // columns.push(<Table.Cell key={i + 'status'}>{event.status == 'C' ? 'Close' : 'Open'}</Table.Cell>);

                if (roleId == 1) {
                    columns.push(
                        <Table.Cell key={i + 'action'} textAlign='center'>
                            <span>
                                <Button
                                    className='icon-button'
                                    id={event.id}
                                    disabled={disableActions}
                                    onClick={this.onEdit}
                                >
                                    <Icon title="Edit" name='edit' size='large'/>
                                </Button>
                            </span>
                            <span>
                                <Button
                                    className='icon-button'
                                    id={event.id}
                                    onClick={this.onResend}
                                >
                                    <Icon title="Resend mail" name='send' size='large'/>
                                </Button>
                            </span>
                            <span>
                                <Button
                                    className='icon-button'
                                    id={event.id}
                                    disabled={disableActions}
                                    onClick={this.onDelete}
                                >
                                    <Icon title="Delete" name='trash' size='large'/>
                                </Button>
                            </span>
                        </Table.Cell>
                    );
                }
                else {

                    var status = '';
                    if (!event.consolidated) {
                        status = <Icon name='close' color='red'/>;
                    }
                    else{
                        status = <Icon name='check' color='green'/>;
                    }
                    columns.push(
                        <Table.Cell key={i + 'action'} textAlign='center'>
                            <div style={{display:'flex',flexDirection:'column'}}>
                            <span className="event-link" id={event.id} onClick={this.onAddComments}>
                                Consolidate Report
                            </span>
                            <span className="event-link-pt" id={event.id} onClick={this.onPrintClick}
                                  style={{paddingLeft: 15}}>
                                Print
                            </span>
                                <div style={{paddingTop:10,display:'flex',justifyContent:'center'}}>
                                    <span>Consolidated: </span>
                                    <span style={{paddingLeft:5}}>{status}</span>
                            </div>
                            </div>
                        </Table.Cell>
                    );
                }

                rows.push(
                    <Table.Row key={i + '' + event.id}>
                        {columns}
                    </Table.Row>
                );
            }
        }

        return (
            <div id="events-list">
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Event Name</Table.HeaderCell>
                            <Table.HeaderCell>Date</Table.HeaderCell>
                            <Table.HeaderCell>Time</Table.HeaderCell>
                            <Table.HeaderCell>Role</Table.HeaderCell>
                            <Table.HeaderCell>Leader's Name</Table.HeaderCell>
                            <Table.HeaderCell>State</Table.HeaderCell>
                            <Table.HeaderCell>Parliament Constituency</Table.HeaderCell>
                            <Table.HeaderCell>Assigned to</Table.HeaderCell>
                            <Table.HeaderCell>Action</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {rows}
                    </Table.Body>
                </Table>
            </div>
        );
    }
}
