import React, {Component} from 'react';
import {Form, Message, Modal, Divider, Segment, Icon, Button, Dropdown, Dimmer, Loader} from 'semantic-ui-react';
import toastr from 'toastr';
import './ManageUser.css'
import _ from "underscore";
import SMAUtils from "../../../common/SMAUtils";

var jq = window.$;
export default class CreateUser extends Component {

    state = {
        disableLoader: true,
        openFlag: false,
        LoginUser: {},
        userName: '',
        roleId: 0,
        role: "",
        email: "",
        mobileNo: '',
        stateId: 0,
        stateName: '',
        constituencyIds: [],
        constituencyNames: '',
        userNameValidation: 'please enter userName',
        constituencyNameValidateMsg: '',
        roles: [],
        states: [],
        constituencies: [],
        form: {
            userName: '',
            roleId: 0,
            role: '',
            email: '',
            mobileNo: '',
            stateId: 0,
            stateName: '',
            constituencyIds: '',
            constituencyNames: '',
        },
    };

    componentWillReceiveProps(props) {
        if (props.openFlag) {
            var openFlag = props.openFlag;
            var user = JSON.parse(sessionStorage.user);
            this.setState({openFlag: openFlag, LoginUser: user});
            this.init(user);
        }
    };

    init(user) {
        //let user = JSON.parse(sessionStorage.user);
        this.getRole(user);
        this.getStates(user.id);
    };

    getRole(user) {
        //let user = JSON.parse(sessionStorage.user);
        this.setState({disableLoader: false});
        var that = this;
        jq.post({
            url: window.ajaxPrefix + "mvc/getUserRoles?loginUserId=" + user.id,
            type: "GET",
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (response, status, request) {
                var resdata = response;
                that.setState({disableLoader: true});
                if (response && response.length > 0) {
                    that.setRoles(response);
                }
            },
            error: function (xhr, status, err) {

                if (xhr.responseJSON)
                    SMAUtils.error(xhr.responseJSON.errorMessage);
                that.setState({disableLoader: true});

            }
        });
    };

    setRoles = (res) => {
        var roles = [];
        for (var i = 0; i < res.length; i++) {
            var row = [];
            row.id = res[i].id;
            row.value = res[i].id;
            row.key = i;
            row.text = res[i].name;
            roles.push(row);

        }
        this.setState({roles: roles});
    };

    getStates(userId) {
        var that = this;
        jq.ajax({
            url: window.ajaxPrefix + "mvc/getStates?loginUserId=" + userId,
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
        //let user = JSON.parse(sessionStorage.user);
        let user = this.state.LoginUser;
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
                that.setState({disableLoader: true});
                if (xhr.responseJSON)
                    SMAUtils.error(xhr.responseJSON.errorMessage);
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

    onCancel() {
        this.resetState();
        this.props.closeModal();

    };

    resetState() {
        this.setState({
            userName: '', roleId: 0, role: '',
            mobileNo: '', email: '', stateId: 0, stateName: '',
            constituencyIds: [], constituencyNames: '',
            userNameValidationFailed: false,
            roleValidationFailed: false,
            emailValidationFailed: false,
            mobileNoValidationFailed: false,
            stateValidationFailed: false,
            constituencyValidationFailed: false,
            constituencyNameValidateMsg: '',
            constituencies: []
        });
    };

    handleUserNameChange(event, data) {
        this.setState({userName: data.value, userNameValidationFailed: false})
    };

    handleRoleChange = (event, data) => {
        var roleId = data.value;
        this.setState({
            roleId: roleId,
            constituencyNameValidateMsg: '',
            constituencyValidationFailed: false,
            roleValidationFailed: false
        });
    };

    handleEmailChange(event, data) {
        this.setState({email: data.value, emailValidationFailed: false});
    };

    handleMobileNoChange(event, data) {
        this.setState({mobileNo: data.value, mobileNoValidationFailed: false});
    };

    handleStateChange = (event, data) => {
        var stateId = data.value;
        this.setState({
            stateId: stateId,
            constituencies: [],
            constituencyIds: [],
            constituencyNames: [],
            constituencyNameValidateMsg: '',
            constituencyValidationFailed: false,
            stateValidationFailed: false
        });
        this.getConstituencies(stateId);

    };
    handleConstituenciesChange = (event, data) => {
        this.setState({
            constituencyIds: data.value, constituencyNameValidateMsg: '',
            constituencyValidationFailed: false,
        });
    };

    validate() {
        var userName = this.state.userName;
        var roleId = this.state.roleId;
        var mobileNo = this.state.mobileNo;
        var email = this.state.email;
        var stateId = this.state.stateId;
        var constituencyIds = this.state.constituencyIds;
        var validateMsg = "";
        var userNameValidationFailed = false;
        var roleValidationFailed = false;
        var emailValidationFailed = false;
        var mobileNoValidationFailed = false;
        var stateValidationFailed = false;
        var constituencyValidationFailed = false;

        if (userName === null || userName.length === 0 || userName.length >= 50) {
            userNameValidationFailed = true;
            validateMsg += "Please enter a valid Name.  \n";
        }
        else {
            userNameValidationFailed = false;
        }

        if (roleId === null || roleId == 0) {
            roleValidationFailed = true;
            validateMsg += "Please select a Role.  \n";
        }
        else {
            roleValidationFailed = false;
        }
        if (mobileNo === null || mobileNo.length === 0 || !mobileNo.match(/^[6-9]\d{9}$/)) {
            mobileNoValidationFailed = true;
            validateMsg += "Please enter a valid Mobile No.  \n";
        }
        else {
            mobileNoValidationFailed = false;
        }

        if (email === null || email.length === 0 || SMAUtils.validateEmail(email)) {
            emailValidationFailed = true;
            validateMsg += "Please enter a valid Email.  \n";
        }
        else {
            emailValidationFailed = false;
        }
        if (stateId === null || stateId == 0) {
            stateValidationFailed = true;
            validateMsg += "Please select a State.  \n";
        }
        else {
            stateValidationFailed = false;
        }
        if (constituencyIds === null || constituencyIds.length === 0) {
            constituencyValidationFailed = true;
            validateMsg += "Please select constituencies.  \n";
        }
        else {
            constituencyValidationFailed = false;
        }

        this.setState({
            userNameValidationFailed: userNameValidationFailed,
            roleValidationFailed: roleValidationFailed,
            emailValidationFailed: emailValidationFailed,
            mobileNoValidationFailed: mobileNoValidationFailed,
            stateValidationFailed: stateValidationFailed,
            constituencyValidationFailed: constituencyValidationFailed,
        });
        return validateMsg;

    }

    handleSubmit() {
        var validateMsg = this.validate();

        if (validateMsg.length > 0) {
        }
        else {
            var constituenciesIds = this.state.constituencyIds.toString();
            var form = this.state.form;
            form.userId = -1;
            form.userName = this.state.userName;
            form.roleId = this.state.roleId;
            form.email = this.state.email;
            form.mobileNo = this.state.mobileNo;
            form.stateId = this.state.stateId;
            form.constituencyIds = constituenciesIds;
            this.setState({form: form, disableLoader: false});
            var that = this;
            //let user = JSON.parse(sessionStorage.user);
            let user = that.state.LoginUser;

            jq.ajax({
                url: window.ajaxPrefix + "mvc/saveEventUser?loginUserId=" + user.id,
                type: "POST",
                dataType: "json",
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(that.state.form),
                success: function (response) {
                    that.setState({disableLoader: true});
                    if (response && response.statusId == 1) {
                        SMAUtils.success(response.comments + "!");
                        that.resetState();
                        that.props.onSave();
                        that.props.closeModal();
                    }
                    else if (response && response.statusId == 2) {
                        that.setState({
                            constituencyValidationFailed: true,
                            constituencyNameValidateMsg: response.comments
                        });
                    }
                },

                error: function (xhr, status, err) {
                    that.setState({disableLoader: true,});
                    SMAUtils.error("An error occurred while Creating Manager. please contact your Support Team.");
                }
            });

        }
    }


    render() {
        return (
            <Modal size={'large'} open={this.props.openFlag} className='mm-user'>
                <Modal.Header>
                    <Button
                        className='close-btn' style={{margin: '0px'}}
                        onClick={this.onCancel.bind(this)}
                    >
                        <Icon size='large' name="remove"/>
                    </Button>

                    Create Manager
                </Modal.Header>
                <Modal.Content>
                    <div className="model-content">
                        <Form>
                            <Form.Group widths='equal'>
                                <Form.Field>
                                    <Form.Input label="Name" placeholder='Enter the Name here..'
                                                value={this.state.userName}
                                                onChange={this.handleUserNameChange.bind(this)}
                                                error={this.state.userNameValidationFailed}/>
                                </Form.Field>
                                <Form.Field>
                                    <Form.Select label='Role' placeholder='Select a Role' search selection
                                                 value={this.state.roleId}
                                                 options={this.state.roles}
                                                 onChange={this.handleRoleChange}
                                                 onSelectBlur={false}
                                                 error={this.state.roleValidationFailed}
                                    />
                                </Form.Field>
                            </Form.Group>

                            <Form.Group widths='equal'>
                                <Form.Field>
                                    <Form.Input label="Email" placeholder='Enter the Email here..'
                                                value={this.state.email}
                                                onChange={this.handleEmailChange.bind(this)}
                                                error={this.state.emailValidationFailed}/>
                                    <Message error={true} visible={this.state.email.length > 0 && this.state.emailValidationFailed}
                                             content={"Please enter valid Email."}/>
                                </Form.Field>
                                <Form.Field>
                                    <Form.Input label="Mobile No" placeholder='Mobile No'
                                                value={this.state.mobileNo}
                                                onChange={this.handleMobileNoChange.bind(this)}
                                                error={this.state.mobileNoValidationFailed}/>
                                    <Message error={true} visible={this.state.mobileNoValidationFailed}
                                             content='Please enter valid Mobile No.'/>
                                </Form.Field>
                            </Form.Group>

                            <Form.Group widths='equal'>
                                <Form.Field>
                                    <Form.Select label='State' placeholder='Select a State' search selection
                                                 value={this.state.stateId}
                                                 options={this.state.states}
                                                 onChange={this.handleStateChange}
                                                 onSelectBlur={false}
                                                 error={this.state.stateValidationFailed}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Form.Select label='Parliament Constituencies'
                                                 placeholder='Select Parliament Constituencies' search selection
                                                 multiple
                                                 value={this.state.constituencyIds}
                                                 options={this.state.constituencies}
                                                 onChange={this.handleConstituenciesChange}
                                                 onSelectBlur={false}
                                                 error={this.state.constituencyValidationFailed}
                                    />
                                    <Message error={true} visible={this.state.constituencyNameValidateMsg.length > 0}
                                             content={this.state.constituencyNameValidateMsg}/>
                                </Form.Field>
                            </Form.Group>
                        </Form>
                    </div>
                </Modal.Content>
                <Modal.Actions>
                    <div>
                        <Button content='Cancel'
                                className='cancel-btn'
                                onClick={this.onCancel.bind(this)}
                        />
                        <Button primary content='Save' className='save-btn'
                                onClick={this.handleSubmit.bind(this)}
                        />
                    </div>
                </Modal.Actions>

                <Dimmer inverted active disabled={this.state.disableLoader}>
                    <Loader size='huge' disabled={this.state.disableLoader} content="Loading"/>
                </Dimmer>
            </Modal>
        );
    }
}

