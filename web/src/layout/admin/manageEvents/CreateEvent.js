import React, {Component} from 'react';
import {Radio, Input, Dimmer, Modal, Loader, Button, Form, Icon, Dropdown} from 'semantic-ui-react';
import SMAUtils from "../../../common/SMAUtils";
import _ from "underscore";

const moment = require('moment');
var jq = window.$;
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import './ManageEvent.css'

export default class CreateEvent extends Component {

    state = {
        openFlag: false,
        user: {},
        disableLoader: true,
        leaderRoles: [],
        states: [],
        constituencies: [],
        eventRoles: [],
        eventName: '',
        eventDateTime: '',
        leaderRoleName: '',
        leaderName: '',
        leaderRoleId: '',
        leaders: '',
        inputFieldDisabled: true,
        stateId: '',
        stateName: '',
        constituencyId: '',
        constituencyName: '',
        constituencyNameError: false,
        stateNameError: false,
        leaderRoleNameError: false,
        leaderNameError: false,
        eventNameError: false,
        eventDateTimeError: false,
        roleId: '',
        eventData: null,
        eventId: -1,
        isEdit: false
    };


    componentWillReceiveProps(props) {
        if (props.openFlag) {
            var openFlag = props.openFlag;
            this.state.user = JSON.parse(sessionStorage.user);
            if (props.eventData && props.eventData.id) {
                const eventData = props.eventData;
                const eventName = eventData.eventName;
                const eventId = eventData.id;
                const eventDateTime = moment(eventData.date);
                const roleId = eventData.leaderRoleId;
                const leaderRoleName = eventData.role;
                const leaderName = eventData.leaderName;
                const stateId = eventData.stateId;
                const stateName = eventData.state;
                const constituencyId = eventData.parliamentId;
                const constituencyName = eventData.parliament;

                var leaderRoleId = roleId;
                var inputFieldDisabled = true;
                if (roleId >= 4) {
                    inputFieldDisabled = false;
                    leaderRoleId = 4;
                }

                this.setState({
                    openFlag: openFlag,
                    eventData: eventData,
                    eventName: eventName,
                    eventId: eventId,
                    eventDateTime: eventDateTime,
                    roleId: roleId,
                    leaderRoleId: leaderRoleId,
                    leaderRoleName: leaderRoleName,
                    leaderName: leaderName,
                    stateId: stateId,
                    stateName: stateName,
                    constituencyId: constituencyId,
                    constituencyName: constituencyName,
                    inputFieldDisabled: inputFieldDisabled,
                    isEdit: true
                });
                this.getConstituencies(stateId);

            } else {
                this.setState({openFlag: openFlag, isEdit: false});
            }
            this.init();
        }
    }

    componentDidMount() {

    }

    init() {
        this.getLeaderRoles();
        this.getStates();
    };


    getLeaderRoles() {
        this.setState({disableLoader: false});
        var that = this;
        jq.post({
            url: window.ajaxPrefix + "mvc/getLeaderRoles?loginUserId=" + that.state.user.id,
            type: "GET",
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (response, status, request) {
                var resdata = response;
                that.setState({disableLoader: true});
                if (response && response.length > 0) {
                    that.setState({leaders: response});
                    that.setLeaderRoles(response);
                }
            },
            error: function (xhr, status, err) {
                that.setState({disableLoader: true});
                if (xhr.responseJSON)
                    SMAUtils.error(xhr.responseJSON.errorMessage);
            }
        });
    };

    setLeaderRoles(resp) {
        var eventRoles = [];
        for (var i = 0; i < resp.length; i++) {
            if (resp[i].leaderRoleId >= 5) {
                var row = {};
                row.key = i;
                row.text = resp[i].leaderRoleName;
                row.id = resp[i].leaderRoleId;
                row.value = resp[i].leaderRoleId;
                eventRoles.push(row);
            }
        }

        var leaderRoleName = resp[0].leaderRoleName;
        var leaderRoleId = resp[0].leaderRoleId;
        var roleId = resp[0].leaderRoleId;
        var leaderName = resp[0].leaderName;
        if (this.state.isEdit) {
            leaderRoleName = this.state.leaderRoleName;
            leaderRoleId = this.state.leaderRoleId;
            roleId = this.state.roleId;
            leaderName = this.state.leaderName;
        }
        this.setState({
            eventRoles,
            leaderRoleName,
            leaderRoleId,
            roleId,
            leaderName,
        });
    }

    getLeaderById(id) {
        const leader = _.findWhere(this.state.leaders, {leaderRoleId: parseInt(id)});
        return leader ? leader : {};
    }

    onLeaderRoleChange = (event, data) => {
        var roleId = data.value;
        const leader = this.getLeaderById(roleId);
        var inputFieldDisabled = true;
        var leaderRoleName = leader.leaderRoleName;
        if (roleId >= 4) {
            inputFieldDisabled = false;
            leaderRoleName = '';
            roleId = 0;
        }

        this.setState({
            leaderRoleName: leaderRoleName,
            leaderRoleId: data.value,
            leaderName: leader.leaderName,
            inputFieldDisabled: inputFieldDisabled,
            roleId: roleId,
        });
    };

    getStates() {
        var that = this;
        jq.ajax({
            url: window.ajaxPrefix + "mvc/getStates?loginUserId=" + that.state.user.id,
            type: "GET",
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            success: function (response) {

                if (response.length > 0) {
                    that.formatState(response);
                }

            },
            error: function (xhr, status, err) {
                if (xhr.responseJSON)
                    SMAUtils.error(xhr.responseJSON.errorMessage);
            }
        });
    };

    formatState(rows) {
        if (rows.length > 0) {
            var states = [];
            for (var i = 0; i < rows.length; i++) {
                var row = {};
                row.key = i;
                row.text = rows[i].name;
                row.id = rows[i].id;
                row.value = rows[i].id;
                states.push(row);
            }
            this.setState({states: states});
        }
    };

    getConstituencies(stateId) {
        let user = this.state.user;
        this.setState({disableLoader: false});
        var that = this;
        jq.post({
            url: window.ajaxPrefix + "mvc/getParliaments?loginUserId=" + user.id + "&stateId=" + stateId,
            type: "GET",
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (response, status, request) {
                var resdata = response;
                that.setState({disableLoader: true});
                if (response && response.length > 0) {
                    that.setConstituencies(response);
                }
            },
            error: function (xhr, status, err) {

                if (xhr.responseJSON)
                    SMAUtils.error(xhr.responseJSON.errorMessage);
                that.setState({disableLoader: true});
            }
        });
    }

    setConstituencies(res) {
        var constituencies = [];
        for (var i = 0; i < res.length; i++) {
            var row = [];
            row.id = res[i].id;
            row.value = res[i].id;
            row.key = i;
            row.text = res[i].name;
            constituencies.push(row);
        }
        this.setState({constituencies: constituencies});

    }

    validate() {
        var leaderName = this.state.leaderName;
        var leaderRoleId = this.state.roleId;
        var stateId = this.state.stateId;
        var constyId = this.state.constituencyId;
        var eventName = this.state.eventName;
        var eventDateTime = this.state.eventDateTime;
        var constituencyNameError = false;
        var stateNameError = false;
        var leaderRoleNameError = false;
        var leaderNameError = false;
        var eventNameError = false;
        var eventDateTimeError = false;
        var error = false;
        if (eventName == null || eventName.length <= 0 || eventName.length >= 100) {
            error = eventNameError = true;
        }
        if (eventDateTime == null || eventDateTime.length <= 0) {
            error = eventDateTimeError = true;
        }
        if (leaderName == null || leaderName.length <= 0 || leaderName.length >= 50) {
            error = leaderNameError = true;
        }
        if (leaderRoleId == null || leaderRoleId == 0) {
            error = leaderRoleNameError = true;
        }
        if (stateId == null || stateId == 0) {
            error = stateNameError = true;
        }
        if (constyId == null || constyId == 0) {
            error = constituencyNameError = true;
        }
        this.setState({
            constituencyNameError,
            stateNameError,
            leaderRoleNameError,
            leaderNameError,
            eventDateTimeError,
            eventNameError,
        });

        return error;
    };

    handleSubmit() {
        if (this.validate()) {
            SMAUtils.warning("Please fill the all fields");
        }
        else {
            var form = {};

            form.eventName = this.state.eventName;
            form.eventId = this.state.eventId ? this.state.eventId : -1;
            form.date = this.state.eventDateTime;
            form.leaderRoleId = this.state.roleId;
            form.leaderName = this.state.leaderName;
            form.stateId = this.state.stateId;
            form.parliamentId = this.state.constituencyId;
            this.setState({form: form, disableLoader: false});
            var that = this;
            let user = that.state.user;
            const eventIdd = this.state.eventId;

            jq.ajax({
                url: window.ajaxPrefix + "mvc/saveEvent?loginUserId=" + user.id,
                type: "POST",
                dataType: "json",
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(form),
                success: function (response) {
                    if (eventIdd == -1) {
                        SMAUtils.success("Event created Successfully");
                    }
                    that.setState({disableLoader: true});
                    that.props.onSave(response, eventIdd);
                    that.props.closeModal();
                    that.resetState();
                },
                error: function (xhr, status, err) {
                    that.setState({disableLoader: true,});
                    SMAUtils.error("An error occurred while saving Event. please contact your Support Team.");
                }
            });
        }
    }

    onCancel() {
        this.resetState();
        this.props.closeModal();

    }

    resetState() {
        this.setState({
            openFlag: false,
            user: {},
            disableLoader: true,
            leaderRoles: [],
            states: [],
            constituencies: [],
            eventRoles: [],
            eventName: '',
            eventDateTime: '',
            leaderRoleName: "",
            leaderName: '',
            leaderRoleId: '',
            leaderRole: '',
            inputFieldDisabled: true,
            stateId: '',
            stateName: '',
            constituencyId: '',
            constituencyName: '',
            constituencyNameError: false,
            stateNameError: false,
            leaderRoleNameError: false,
            leaderNameError: false,
            eventNameError: false,
            eventDateTimeError: false,
            eventData: null,
            eventId: -1,

        });
    };

    handleEventName(event, data) {
        this.setState({eventName: data.value, eventNameError: false});
    };

    handleDateChange = (event, data) => {
        this.setState({eventDateTime: event, eventDateTimeError: false});
    };

    handleLeaderName(event, data) {
        this.setState({leaderName: data.value, leaderNameError: false});
    };

    handleRoleName = (event, data) => {
        this.setState({roleId: data.value, leaderRoleNameError: false});
    };

    handleStateChange = (event, data) => {
        var stateId = data.value;
        this.setState({
            stateId: stateId,
            constituencies: [],
            constituencyId: '',
            constituencyName: "",
            stateNameError: false
        });
        this.getConstituencies(stateId);

    };
    handleConstituencyChange = (event, data) => {
        this.setState({constituencyId: data.value, constituencyNameError: false});
    };


    render() {
        const {
            leaders,
            leaderRoleId,
            leaderRoleName,
            leaderName,
            eventDateTime,
            eventName,
            inputFieldDisabled,
            states,
            constituencies,
            eventRoles,
            stateId,
            roleId,
            constituencyId,
            constituencyNameError,
            stateNameError,
            leaderRoleNameError,
            leaderNameError,
            eventNameError,
            eventDateTimeError,
            isEdit
        } = this.state;

        var leaderRoles = [];
        for (var i = 0; i < leaders.length; i++) {
            if (leaders[i].leaderRoleId <= 4) {
                leaderRoles.push(
                    <div className='col-3'>
                        <Radio
                            label={leaders[i].leaderRoleName}
                            value={leaders[i].leaderRoleId}
                            checked={leaderRoleId == leaders[i].leaderRoleId}
                            onClick={this.onLeaderRoleChange}
                        />
                    </div>
                );
            }
        }

        const dateError = eventDateTimeError ? 'date-picker-error' : '';

        return (
            <Modal size={'large'} open={this.props.openFlag}>
                <Modal.Header>
                    <Button
                        className='close-btn' style={{margin: '0px'}}
                        onClick={this.onCancel.bind(this)}>
                        <Icon size='large' name="remove"/>
                    </Button>

                    {isEdit ? 'Edit Event' : 'Create Event'}
                </Modal.Header>
                <Modal.Content>
                    <div className="model-content">
                        <div className='container-fluid'>
                            <div className='row event-date'>
                                <div className='col-6' style={{display: 'flex'}}>
                                    <div style={{flex: 1, alignSelf: 'center'}}>
                                        <label>Event Name:</label>
                                    </div>
                                    <div style={{flex: 3}}>
                                        <Input
                                            placeholder='Event Name'
                                            value={eventName}
                                            onChange={this.handleEventName.bind(this)}
                                            error={eventNameError}
                                        />
                                    </div>
                                </div>
                                <div className='col-6'>
                                    <label>Date:</label>
                                    <div className={`event-date-pickr ${dateError}`}>
                                        <DatePicker
                                            className="react-datepicker__time"
                                            showTimeSelect
                                            selected={eventDateTime}
                                            onChange={this.handleDateChange}
                                            timeFormat="hh:mm A"
                                            timeIntervals={15}
                                            timeCaption="time"
                                            dateFormat="DD/MM/YYYY hh:mm A"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="hr-dotted"></div>

                            <div className='row' style={{paddingBottom: 5}}>
                                {leaderRoles}
                            </div>
                            <div className="hr-dotted"></div>
                            <div className='row inp-wid'>
                                <div className='col-2'>
                                    <label>Leader Name:</label>
                                </div>
                                <div className='col-3'>
                                    <Input
                                        placeholder='Leader Name'
                                        value={leaderName}
                                        disabled={inputFieldDisabled}
                                        onChange={this.handleLeaderName.bind(this)}
                                        error={leaderNameError}
                                    />
                                </div>
                            </div>

                            <div className='row inp-wid'>
                                <div className='col-2'>
                                    <label>Role:</label>
                                </div>
                                <div className='col-3'>
                                    {
                                        inputFieldDisabled ?
                                            <Input
                                                placeholder='Leader Name'
                                                value={leaderRoleName}
                                                disabled={inputFieldDisabled}
                                            /> :
                                            <Dropdown
                                                selection search
                                                placeholder='Role'
                                                options={eventRoles}
                                                value={roleId}
                                                onChange={this.handleRoleName}
                                                error={leaderRoleNameError}
                                                selectOnBlur={false}
                                            />
                                    }
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-2'>
                                    <label>State:</label>
                                </div>
                                <div className='col-3'>
                                    <Dropdown
                                        placeholder='Select State' fluid selection search
                                        value={stateId}
                                        options={states}
                                        disabled={this.state.eventId == -1 ? false : true}
                                        onChange={this.handleStateChange}
                                        error={stateNameError}
                                        selectOnBlur={false}
                                    />
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-2'>
                                    <label>Parliament Constituency:</label>
                                </div>
                                <div className='col-3'>
                                    <Dropdown
                                        placeholder='Select Parliment' fluid selection search
                                        value={constituencyId}
                                        options={constituencies}
                                        disabled={this.state.eventId == -1 ? false : true}
                                        onChange={this.handleConstituencyChange}
                                        error={constituencyNameError}
                                        selectOnBlur={false}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        content='Cancel'
                        className='cancel-btn'
                        onClick={this.onCancel.bind(this)}
                    />
                    <Button
                        primary
                        content='Save'
                        className='save-btn'
                        onClick={this.handleSubmit.bind(this)}
                    />
                </Modal.Actions>
                <Dimmer inverted active disabled={this.state.disableLoader}>
                    <Loader size='huge' disabled={this.state.disableLoader} content="Loading"/>
                </Dimmer>
            </Modal>

        );
    }
}
