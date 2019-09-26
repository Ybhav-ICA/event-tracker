import React, {Component} from 'react';
import {Button, Form, Dimmer, Loader} from 'semantic-ui-react'
import store from '../MainStore';
import SMAUtils from "../common/SMAUtils";
import $ from 'jquery';
import {MANAGE_EVENTS_ROUTE, EVENTS_ROUTE, Questions} from '../common/Constants';

class LoginPage extends Component {

    state = {
        userId: '',
        password: '',
        disableLoader: true
    };

    getDefaultPage = (roleId) => {
        var defaultPage = "";
        if (roleId === 1) {
            defaultPage = MANAGE_EVENTS_ROUTE;
        }
        else if (roleId === 2) {
            defaultPage = EVENTS_ROUTE;
        }
        return defaultPage;
    };

    onLogin = () => {
        const data = {
            userName: this.state.userId,
            password: this.state.password
        };
        this.setState({disableLoader: false});
        const that = this;
        $.post({
            url: window.ajaxPrefix + "mvc/login",
            type: "POST",
            dataType: 'json',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                const validUser = response;
                that.setState({disableLoader: true});

                if (validUser != null) {
                    sessionStorage.setItem('user', JSON.stringify(validUser));

                    store.getAppDispatcher().handleViewAction({
                        actionType: "SET_USER",
                        user: validUser
                    });

                    var defaultPage = that.getDefaultPage(validUser.roleId * 1);
                    defaultPage = defaultPage ? defaultPage : "";
                    window.route(defaultPage);
                }
                else {
                    SMAUtils.error("Invalid UserName or Password. Please try again.");
                }
            },
            error: function (xhr, status, err) {
                that.setState({disableLoader: true});
                if (xhr.status === 417 && xhr.responseJSON) {
                    SMAUtils.error(xhr.responseJSON.errorMessage);
                }
                else {
                    SMAUtils.error("Invalid UserName or Password. Please try again.");
                }
            }
        });
    };

    onUsernameChange = (event, data) => {
        this.setState({userId: data.value});
    };

    onPasswordChange = (event, data) => {
        this.setState({password: data.value});
    };

    onKeyPress = (event) => {
        if (event.charCode === 13) {
            this.onLogin();
        }
    };

    render() {
        const {userId, password, disableLoader} = this.state;

        return (
            <div id="login-div">
                <div className='row' style={{height: '100%'}}>
                    <div className="col-8">
                        <div id="login-left">
                            <label className='logo-title'>Event Tracker</label>
                            <label className='sub-title'>Create, Manage the party events</label>
                        </div>
                    </div>

                    <div className="col-4">
                        <div id="login-right">
                            <div style={{display: 'flex', paddingBottom: 20}}>
                                <img className="header-logo" alt=""/>
                                <h1>Event Tracker</h1>
                            </div>
                            <label>Let's login to your account</label>
                            <div className="login-f">
                                <Form>
                                    <Form.Field className="fld">
                                        <Form.Input
                                            value={userId}
                                            label='User name'
                                            placeholder='User name'
                                            onChange={this.onUsernameChange}
                                        />
                                    </Form.Field>
                                    <Form.Field className="fld">
                                        <Form.Input
                                            value={password}
                                            label='Password'
                                            placeholder='Password' type="password"
                                            onKeyPress={this.onKeyPress}
                                            onChange={this.onPasswordChange}
                                        />
                                    </Form.Field>
                                </Form>
                            </div>
                            <div style={{height: 20}}/>
                            <Button primary onClick={this.onLogin}>Login</Button>
                        </div>
                    </div>
                </div>
                <Dimmer inverted active disabled={disableLoader} page={!disableLoader}>
                    <Loader size='huge' disabled={disableLoader} content="Loading"/>
                </Dimmer>
            </div>
        );
    }
}

export default LoginPage;
