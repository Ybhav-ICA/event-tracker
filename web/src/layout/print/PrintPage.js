import React, {Component} from 'react';
import {Dimmer, Loader} from 'semantic-ui-react';
import SMAUtils from "../../common/SMAUtils";
import MainStore from "../../MainStore";
import PrintTable from "./PrintTable";
import './print.css';

const jq = window.$;

window.onafterprint = () => {
    MainStore.getAppDispatcher().handleViewAction({
        actionType: 'TOGGLE_HEADER',
        displayHeader: true,
    });
    window.route("Events");
};

export default class PrintPage extends Component {
    state = {
        user: {},
        event: {},
        disableLoader: true,
        reportData: []
    };

    componentDidMount() {
        const user = JSON.parse(sessionStorage.getItem('user'));
        const event = MainStore.getEvent();
        if (user) {
            this.state.user = user;
            this.state.event = event;
            this.fetchAnalystReport();
        }
        // window.print();
    }

    fetchAnalystReport() {
        this.setState({disableLoader: false});
        const {user, event} = this.state;
        const that = this;
        jq.ajax({
            url: window.ajaxPrefix + `mvc/analystReport?userId=${user.id}&eventId=${event.id}`,
            type: "GET",
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                that.setState({disableLoader: true});
                if (response) {
                    that.processResponse(response);
                }
            },
            error: function (xhr, status, err) {
                that.setState({disableLoader: true});
                if (xhr.responseJSON)
                    SMAUtils.error(xhr.responseJSON.errorMessage);
            }
        });
    }

    processResponse(response) {
        this.setState({reportData: response});
        setTimeout(()=>{
            window.print();
        }, 100);
    }

    render() {
        const {disableLoader, reportData, event} = this.state;

        const tableProps = {
            data: reportData,
            event
        };

        return (
            <div id='print-page'>
                <PrintTable {...tableProps}/>

                <Dimmer inverted active disabled={disableLoader} page={!disableLoader}>
                    <Loader size='huge' disabled={disableLoader} content="Loading..."/>
                </Dimmer>
            </div>
        );
    }
}