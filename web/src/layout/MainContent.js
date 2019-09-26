import React, {Component} from 'react';
import {Router, Route} from 'react-router';
import history from '../common/AppRouter';
import LoginPage from './LoginPage';
import '../App.css';
import Header from "./Header";
import Admin from "./admin/Admin";
import Questionaire from "./questions/Questionaire";
import ManageEvents from "./admin/manageEvents/ManageEvents";
import ManageUser from "./admin/manageUser/ManageUser";
import Events from "./Analyst/Events";
import PrintPage from "./print/PrintPage";
import MainStore from "../MainStore";
import Downloads from "./Analyst/Downloads";

const jq = window.$;

class MainContent extends Component {

    state = {
        userValid: false,
        displayHeader: true,
    };

    componentDidMount() {
        this.mainStore = MainStore.addChangeListener(this.storeChanged);
    }

    componentWillUnmount() {
        if (this.mainStore)
            this.mainStore.remove();
    }

    storeChanged = (actionType, defaultActionType) => {
        const {disabled} = this.props;
        if (actionType === 'TOGGLE_HEADER') {
            const displayHeader = MainStore.getDisplayHeader();
            this.setState({displayHeader});
        }
    };


    onRouterUpdate() {
        console.log(this.refs.router.state.location.pathname);
        if (this.refs.router) {
            var pathName = this.refs.router.state.location.pathname;

            if (pathName !== (window.routerPrefix + "/")) {
                /*jq.get({
                    url: window.ajaxPrefix + "isLoginValid",
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    success: function (response) {
                        //debugger;
                        //Let the transition happen
                    },
                    error: function (xhr, status, err) {
                        //window.pollPreviousPath = pathName;
                        // on error the global error handler will redirect to the login page
                    }
                });*/
            }
        } else {
            window.route("/Questions");
        }
    }

    render() {
        const {displayHeader} = this.state;

        if (this.props.isSessionValid) {

            var header;
            if (displayHeader) {
                header = <Header/>
            }

            return (
                <div id="main-content">
                    <div style={{flex: 5, width: '100%'}}>
                        <div>
                            {header}
                        </div>
                        <div style={{paddingBottom: 30}}>
                            <Router ref="router" history={history} onUpdate={this.onRouterUpdate.bind(this)}>
                                <Route exact path={window.routerPrefix + "/Admin"} component={Admin}/>
                                <Route exact path={window.routerPrefix + "/ManageEvents"} component={ManageEvents}/>
                                <Route exact path={window.routerPrefix + "/ManageUsers"} component={ManageUser}/>
                                <Route exact path={window.routerPrefix + "/Events"} component={Events}/>
                                <Route exact path={window.routerPrefix + "/Print"} component={PrintPage}/>
                                <Route exact path={window.routerPrefix + "/Downloads"} component={Downloads}/>
                            </Router>
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div id="main-content">
                    <Router ref="router" history={history} onUpdate={this.onRouterUpdate.bind(this)}>
                        <Route exact path={window.routerPrefix + "/"} component={LoginPage}/>
                        <Route exact path={window.routerPrefix + "/Questions"} component={Questionaire}/>
                    </Router>
                </div>
            );
        }
    }
}

export default MainContent;
