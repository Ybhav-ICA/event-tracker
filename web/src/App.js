import React, {Component} from 'react';
import MainContent from './layout/MainContent';
import {browserHistory} from 'react-router';
import './App.css';
import './css/font-awesome-4.7.0/css/font-awesome.min.css';
import './css/semantic-ui-2.2.2/semantic.min.css';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/theme-fresh.css';
import store from './MainStore';
import toastr from 'toastr';
import history from 'history-events';
import {LicenseManager} from "ag-grid-enterprise/main";
import 'bootstrap-slider/dist/css/bootstrap-slider.min.css';
import Questionaire from "./layout/questions/Questionaire";

LicenseManager.setLicenseKey("infocrunch.in_Survey_Manager_1Devs18_August_2018__MTUzNDU0NjgwMDAwMA==5c0b132c9a57ad7b177b1ab7d1bd5cf4");

const location = window.location;

toastr.options = {
    "positionClass": "toast-top-center",
    "closeButton": true, "timeOut": "3000",
};


class App extends Component {

    state = {
        isSessionValid: false,
        questions: false
    };

    // Pass in route without Slash
    route(route) {
        if (window.isLocal) {
            location.href = "#/" + window.routerPrefix + route;
        } else {
            browserHistory.push(window.routerPrefix + "/" + route);
        }
    }

    urlChanged() {
        var tt = location.href.split("/");
        var tk = tt[tt.length - 1];
        if (tk === "logout" || tk === "") {
            this.setState({isSessionValid: false});
        }
    }

    storeChanged(actionType, defaultActionType) {
        if (actionType === "SET_USER") {
            this.setState({isSessionValid: true});
        }
    }

    componentDidMount() {
        var url = new URL(document.location.href);
        if (url && url.href && url.href.indexOf("type=form") != -1) {
            this.setState({questions: true});
        } else {
            this.setState({questions: false});
            store.addChangeListener(this.storeChanged.bind(this));
            window.addEventListener('popstate', this.urlChanged.bind(this));
            if (history.isHistorySupported()) {
                window.addEventListener('changestate', this.urlChanged.bind(this));
            }
            window.route = this.route;
            window.route("");
        }
    }

    render() {
        var displayItem = <MainContent isSessionValid={this.state.isSessionValid}/>;
        if (this.state.questions) {
            displayItem = <Questionaire/>;
        }
        return (
            <div style={{height: '100%'}}>
                {displayItem}
            </div>
        );
    }
}

export default App;
