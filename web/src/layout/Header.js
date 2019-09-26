import React, {Component} from 'react';
import {Menu} from 'semantic-ui-react';
import {
    MANAGE_EVENTS,
    MANAGE_USERS,
    EVENTS,
    EVENTS_ROUTE,
    MANAGE_EVENTS_ROUTE,
    MANAGE_USERS_ROUTE,
    DOWNLOADS,
    DOWNLOADS_ROUTE
} from '../common/Constants';
import $ from "jquery";
import SMAUtils from "../common/SMAUtils";

export default class Header extends Component {

    state = {
        user: {},
        activeItem: '',
        disableLoader: true
    };

    componentDidMount() {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (user) {
            this.setState({
                user,
                activeItem: this.getActiveItem(user.roleId)
            });
        }
    }

    getActiveItem = (roleId) => {
        var activeItem = "";
        if (roleId === 1) {
            activeItem = MANAGE_EVENTS;
        }
        else if (roleId === 2) {
            activeItem = EVENTS;
        }
        return activeItem;
    };

    logout = () => {
        this.setState({disableLoader: false});
        const that = this;
        $.get({
            url: window.ajaxPrefix + "mvc/logout",
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                that.setState({disableLoader: true});
                window.route("");
            },
            error: function (xhr, status, err) {
                that.setState({disableLoader: true});
                if (xhr.responseJSON)
                    SMAUtils.error(xhr.responseJSON.errorMessage);
            }
        });
    };

    onDashBoard = (e, obj) => {
        const activeItem = obj.name;
        var route = '';
        if (activeItem === MANAGE_EVENTS) {
            route = MANAGE_EVENTS_ROUTE;
        }
        else if (activeItem === MANAGE_USERS) {
            route = MANAGE_USERS_ROUTE;
        }
        else if (activeItem === EVENTS) {
            route = EVENTS_ROUTE;
        }
        else if (activeItem === DOWNLOADS) {
            route = DOWNLOADS_ROUTE;
        }
        this.setState({activeItem});
        window.route(route);
    };

    render() {
        const {user, activeItem} = this.state;

        var roleId = 0;
        if (user) {
            roleId = user.roleId;
        }

        const headerNavRight = {
            margin: '25px 20px 0 0',
            display: 'flex',
            flexDirection: 'row'
        };

        const active = {
            borderBottom: '3px solid orange',
            color: '#000000'
        };

        const inActive = {color: '#000000'};

        var displayItem = [];
        if (roleId === 1) {
            displayItem = [
                <Menu.Item key={MANAGE_EVENTS} name={MANAGE_EVENTS} onClick={this.onDashBoard}
                           style={activeItem === MANAGE_EVENTS ? active : inActive}/>,

                <Menu.Item key={MANAGE_USERS} name={MANAGE_USERS} onClick={this.onDashBoard}
                           style={activeItem === MANAGE_USERS ? active : inActive}/>,

            ];
        }
        else if (roleId === 2) {
            displayItem = [
                <Menu.Item key={EVENTS} name={EVENTS} onClick={this.onDashBoard}
                           style={activeItem === EVENTS ? active : inActive}/>,
            ];
        }

        displayItem.push(
            <Menu.Item key={DOWNLOADS} name={DOWNLOADS} onClick={this.onDashBoard}
                       style={activeItem === DOWNLOADS ? active : inActive}/>,
        );

        return (
            <div id="main-header" className="header-main-style">
                <div id="main-header-inner" style={{width: '100%', height: '100%', display: 'flex'}}>
                    <div>
                        <img className="header-logo" alt=""/>
                    </div>
                    <div style={{
                        flex: 1,
                         paddingTop:41
                    }}>
                        <Menu className="headerMenu">
                            {displayItem}
                        </Menu>
                    </div>
                    <div id="header-nav-right" style={headerNavRight}>
                        <div style={{paddingRight: 0, color: '#000'}}>
                            <p style={{
                                marginTop: 17,
                                marginBottom: 0,
                                fontSize: 18,
                                lineHeight: 1,
                                paddingRight: 40
                            }}> {user ? user.userName : ''}</p>
                        </div>
                        <i title="Logout" className="fa fa-power-off fa-lg fa-2x hdr-btn"
                           onClick={this.logout}
                           style={{
                               paddingRight: 5,
                               paddingTop: 15,
                               width: 30,
                               height: 40,
                               color: '#000',
                               cursor: 'pointer'
                           }}/>
                    </div>
                </div>
            </div>
        );
    }
}

