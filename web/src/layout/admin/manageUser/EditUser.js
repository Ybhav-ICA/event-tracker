import React, {Component} from 'react';
import {Form, Message, Modal, Icon, Button, Dimmer, Loader} from 'semantic-ui-react';
import './ManageUser.css';
import SMAUtils from "../../../common/SMAUtils";
import _ from 'underscore';

const jq = window.$;

export default class EditUser extends Component {

    state = {
        disableLoader: true,
        user: {},
        userId: 0,
        userName: '',
        roleId: 0,
        role: "",
        email: "",
        mobileNo: '',
        stateId: 0,
        stateName: '',
        displayConstyNames: "",
        preservedStateName: '',
        preservedStateId: 0,
        selectedRow: {},
        userNameValidation: 'please enter userName',
        roles: [],
        states: [],
        constituencies: [],
        selectedconstiuency: [],
        finalconstituenciesIds: '',
        constituencyNameValidateMsg: '',
        form: {
            userId: '',
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
        if (props.open) {
            var user = JSON.parse(sessionStorage.user);
            this.setState({
                selectedRow: props.value,
                userName: props.value.userName,
                userId: props.value.userId,
                role: props.value.roleName,
                roleId: props.value.roleId,
                email: props.value.email,
                preservedStateId: props.value.stateId,
                preservedStateName: props.value.stateName,
                mobileNo: props.value.mobileNo,
                stateName: props.value.stateName,
                stateId: props.value.stateId,
                user: user
            });
            this.assignedConstituencies(props.value);
            this.init(props.value.stateId, user);
        }
    };

    assignedConstituencies(rows) {
        if (rows.children.length > 0) {
            var names = "";
            for (var j = 0; j < rows.children.length; j++) {
                names = names + rows.children[j].constituencyName + ", ";
            }
            names = names.substr(0, names.length - 2);
            this.setState({displayConstyNames: names});
        }
    }

    init(stateId, user) {
        this.getStates(user.id);
        this.getConstituencies(stateId, user)
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

    getConstituencies(stateId, user) {
        //let user = JSON.parse(sessionStorage.user);
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
        const value = this.props.value;
        const stateId = parseInt(this.state.stateId);
        for (var i = 0; i < res.length; i++) {
            const val = res[i];
            if (!_.findWhere(value.children, {constituencyId: val.id, stateId})) {
                var row = [];
                row.id = res[i].id;
                row.value = res[i].id;
                row.key = i;
                row.text = res[i].name;
                constituencies.push(row);
            }
        }
        this.setState({constituencies: constituencies});

    }

    onCancel() {
        this.resetState();
        this.props.close();
    };

    resetState() {
        this.setState({
            userId: '', finalconstituenciesIds: '', preservedStateId: 0, preservedStateName: '', selectedRow: {},
            userName: '', roleId: 0, role: '', displayConstyNames: '', selectedconstiuency: [],
            mobileNo: '', email: '', stateId: 0, stateName: '', constituencies: [], states: [],
            constituencyIds: '', constituencyNames: '',
            userNameValidationFailed: false,
            roleValidationFailed: false,
            emailValidationFailed: false,
            mobileNoValidationFailed: false,
            stateValidationFailed: false,
            constituencyValidationFailed: false,
            constituencyNameValidateMsg: '',
        });
    };

    handleUserNameChange =(event, data)=> {
        this.setState({userName: data.value, userNameValidationFailed: false})
    };

    handleRoleChange = (event, data) => {
        if (event.target.id === "")
            return;
        var roleId = data.value.toInteger;
        this.setState({
            roleId: roleId, constituencyNameValidateMsg: '',
            constituencyValidationFailed: false,
            roleValidationFailed: false
        })

    };

    handleEmailChange=(event,data)=> {
        this.setState({email: data.value, emailValidationFailed:false});
    };

    handleMobileNoChange =(event, data)=> {
        this.setState({mobileNo: data.value,mobileNoValidationFailed:false});
    };

    handleStateChange = (event, data) => {
        var stateId = data.value;
        if (stateId === this.state.preservedStateId) {
            this.setState({stateId: stateId});
        } else {
            this.setState({
                stateId: stateId, selectedconstiuency: [], finalconstituenciesIds: '', constituencyNameValidateMsg: '',
                constituencyValidationFailed: false,
                stateValidationFailed: false
            });
        }

        this.getConstituencies(stateId, this.state.user);

    };
    handleConstituenciesChange = (event, data) => {

        var constituency = data.value;
        this.setState({selectedconstiuency: constituency});

    };

    validate() {
        var userName = this.state.userName;
        var roleId = this.state.roleId;
        var mobileNo = this.state.mobileNo;
        var email = this.state.email;
        var stateId = this.state.stateId;
        var finalconstituenciesIds = "";
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

        if (roleId === null) {
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
        if (stateId === null) {
            stateValidationFailed = true;
            validateMsg += "Please select a State.  \n";
        }
        else {
            stateValidationFailed = false;
        }


        if (this.state.selectedconstiuency.length <= 0) {
            var rows = this.state.selectedRow.children;
            for (var k = 0; k < rows.length; k++) {
                finalconstituenciesIds += rows[k].constituencyId + ",";
            }
            finalconstituenciesIds = finalconstituenciesIds.substr(0, finalconstituenciesIds.length - 1);
        }
        else {

            if (stateId != null && stateId == this.state.preservedStateId) {
                var alreadyAvailableConstituencyNames = '';
                for (var i = 0; i < this.state.selectedRow.children.length; i++) {
                    var row = this.state.selectedRow.children[i];
                    finalconstituenciesIds += row.constituencyId + ",";
                    for (var j = 0; j < this.state.selectedconstiuency.length; j++) {
                        var id = this.state.selectedconstiuency[j];
                        if (row.constituencyId == id) {
                            alreadyAvailableConstituencyNames += this.state.selectedRow.children[i].constituencyName + ", ";
                            break;
                        }
                    }
                }
                if (alreadyAvailableConstituencyNames.length > 0) {

                    alreadyAvailableConstituencyNames = alreadyAvailableConstituencyNames.substring(0, alreadyAvailableConstituencyNames.length - 2);
                    this.setState({
                        constituencyNameValidateMsg: "" + alreadyAvailableConstituencyNames + " are already assigned,Please select different constituencies."
                    });
                    constituencyValidationFailed = true;
                    validateMsg += " ples enter valid constituencies"

                } else {
                    constituencyValidationFailed = false;
                    let constyIds = this.state.selectedconstiuency;
                    for (var k = 0; k < constyIds.length; k++) {
                        finalconstituenciesIds += constyIds[k] + ",";
                    }
                }
                finalconstituenciesIds = finalconstituenciesIds.substr(0, finalconstituenciesIds.length - 1);
            } else {
                let constyIds = this.state.selectedconstiuency;
                for (var k = 0; k < constyIds.length; k++) {
                    finalconstituenciesIds += constyIds[k] + ",";
                }
                finalconstituenciesIds = finalconstituenciesIds.substr(0, finalconstituenciesIds.length - 1);

            }

        }
        this.state.finalconstituenciesIds = finalconstituenciesIds;
        this.setState({
            userNameValidationFailed: userNameValidationFailed,
            emailValidationFailed: emailValidationFailed,
            mobileNoValidationFailed: mobileNoValidationFailed,
            roleValidationFailed: roleValidationFailed,
            stateValidationFailed: stateValidationFailed,
            constituencyValidationFailed: constituencyValidationFailed,
            finalconstituenciesIds: finalconstituenciesIds,
        });
        return validateMsg;

    }

    handleSubmit() {
        var validateMsg = this.validate();

        if (validateMsg.length > 0) {
        }
        else {
            var form = this.state.form;
            form.userId = this.state.userId;
            form.userName = this.state.userName;
            form.roleId = this.state.roleId;
            form.email = this.state.email;
            form.mobileNo = this.state.mobileNo;
            form.stateId = this.state.stateId;
            form.constituencyIds = this.state.finalconstituenciesIds;
            this.setState({form: form, disableLoader: false});
            var that = this;
            let user = this.state.user;
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
                        that.props.close();
                        that.props.onSave();

                    }
                    else if (response && response.statusId == 2) {
                        that.setState({
                            constituencyValidationFailed: true,
                            constituencyNameValidateMsg: response.comments,
                            finalconstituenciesIds:""
                        });
                    }
                },

                error: function (xhr, status, err) {
                    that.setState({disableLoader: true,finalconstituenciesIds:''});
                    SMAUtils.error("An error occurred while Updating User. please contact your Support Team.");
                }
            });

        }
    }

    render() {
        var assignedConstiencies;
        if (this.state.stateId == this.state.preservedStateId) {
            assignedConstiencies = (
                <div style={{paddingBottom: 20}}>
                    <label style={{fontSize: '1.2rem'}}>Assigned Constituencies: </label>
                    <div style={{paddingTop: '0.5em', fontSize: '1rem'}}>{this.state.displayConstyNames}</div>
                </div>
            );
        }

        return (
            <Modal open={this.props.open} className='mm-user'>
                <Modal.Header>
                    <Button
                        className='close-btn' style={{margin: '0px'}}
                        onClick={this.onCancel.bind(this)}><Icon size='large' name="remove"/></Button>
                    Edit Manager
                </Modal.Header>

                <Modal.Content style={{top: '10px'}}>
                    {assignedConstiencies}

                    <div className="model-content">
                        <Form>
                            <Form.Group widths='equal'>
                                <Form.Field>
                                    <Form.Input label="Name" placeholder='Enter the Name here..'
                                                value={this.state.userName}
                                                onChange={this.handleUserNameChange}
                                                error={this.state.userNameValidationFailed}/>
                                    <Message error={true} visible={this.state.userNameValidationFailed}
                                             content={this.state.userNameValidation}/>
                                </Form.Field>
                                <Form.Field>
                                    <Form.Input disabled label='Role' placeholder='Role'
                                                value={this.state.role}
                                                onChange={this.handleRoleChange}
                                                error={this.state.roleValidationFailed}
                                    />
                                </Form.Field>

                            </Form.Group>

                            <Form.Group widths='equal'>
                                <Form.Field>
                                    <Form.Input label="Email" placeholder='Enter the Email here..'
                                                value={this.state.email}
                                                onChange={this.handleEmailChange}
                                                error={this.state.emailValidationFailed}/>
                                    <Message error={true} visible={this.state.email.length > 0 && this.state.emailValidationFailed}
                                             content={"Please enter valid Email."}/>
                                </Form.Field>
                                <Form.Field>
                                    <Form.Input label="Mobile No" placeholder='Mobile No'
                                                value={this.state.mobileNo}
                                                onChange={this.handleMobileNoChange}
                                                error={this.state.mobileNoValidationFailed}/>
                                    <Message error={true} visible={this.state.mobileNoValidationFailed}
                                             content='Please enter valid Mobile No.'/>
                                </Form.Field>
                            </Form.Group>

                            <Form.Group widths='equal'>
                                <Form.Field>
                                    <Form.Select label='State' placeholder='Select State' fluid search selection
                                                 value={this.state.stateId}
                                                 options={this.state.states}
                                                 onChange={this.handleStateChange}
                                                 onSelectBlur={false}
                                                 error={this.state.stateValidationFailed}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Form.Select label='Parliament Constituencies'
                                                 placeholder='Select Parliament Constituencies' fluid search
                                                 selection multiple
                                                 value={this.state.selectedconstiuency}
                                                 options={this.state.constituencies}
                                                 onSelectBlur={false}
                                                 onChange={this.handleConstituenciesChange}
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
                                onClick={this.onCancel.bind(this)}/>
                        <Button primary content='Update' className='action-btn'
                                onClick={this.handleSubmit.bind(this)}/>
                    </div>
                </Modal.Actions>

                <Dimmer inverted active disabled={this.state.disableLoader}>
                    <Loader size='huge' disabled={this.state.disableLoader} content="Loading"/>
                </Dimmer>
            </Modal>
        );
    }
}

