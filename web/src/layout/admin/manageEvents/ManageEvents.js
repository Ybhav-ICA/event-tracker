import React, {Component} from 'react';
import {Radio, Button, Dimmer, Loader, Divider} from 'semantic-ui-react';
import CreateEvent from "./CreateEvent";
import SMAUtils from "../../../common/SMAUtils";
import EditUserRenderer from "../manageUser/EditUserRenderer";
import {ReactBootstrapSlider} from "react-bootstrap-slider";
import Pagination from "react-js-pagination";
import Events from "../../Analyst/Events";
import ConfirmationPopUp from "../../../common/ConfirmationPopUp";
import MainStore from "../../../MainStore";

var jq = window.$;

export default class ManageEvents extends Component {

    state = {
        leaderRole: '',
        totalNoOfEvents: 0,
        inProgressEvent: 0,
        closeEvent: 0,
        openFlag: false,
        dimmerFlag: false,
        disableLoader: true,
        activePage: 1,
        totalItemsCount: 0,
        itemsPerPage: 200,
        user: {},
        events: [],
        eventData: null,
        showPopUp: false,
        emailNotification: false,
        event: {}
    };

    componentDidMount() {
        var user = JSON.parse(sessionStorage.user);
        this.state.user = user;

    }

    handleCreateEvent = () => {
        this.setState({openFlag: true, eventData: {}});
    };

    onEditClicked = (event) => {
        this.setState({openFlag: true, eventData: event});
    };

    onDeleteClicked = (event) => {
        this.setState({showPopUp: !this.state.showPopUp, eventData: event});
    };

    setEventValues = (totalNoOfEvents, inProgressEvent, closeEvent) => {
        this.setState({totalNoOfEvents: totalNoOfEvents, inProgressEvent: inProgressEvent, closeEvent: closeEvent})
    };

    sendMail(eventId, stateId, resend) {
        const loginUserId = this.state.user.id;
        this.setState({disableLoader: false});
        var that = this;
        jq.post({
            url: window.ajaxPrefix + "mvc/sendEmail?userId=" + loginUserId + "&eventId=" + eventId + "&stateId=" + stateId + "&resend=" + resend,
            type: "GET",
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                that.setState({disableLoader: true});
                that.getEvents();
                if (resend && response) {
                    SMAUtils.success("Emails sent successfully");
                }
                else if (resend) {
                    SMAUtils.warning("No users assigned to this constituency.");
                }
            },
            error: function (xhr) {
                that.setState({disableLoader: true});
                if (xhr.responseJSON)
                    SMAUtils.error(xhr.responseJSON.errorMessage);
            }
        });
    }

    onResendClicked = (event) => {
        this.sendMail(event.id, event.stateId, 1);
    };

    oncloseModal = () => {
        this.setState({openFlag: false, eventData: {}});
    };

    onEventSave = (event, flag) => {
        this.setState({openFlag: false, eventData: {}});

        if (flag == -1) {
            this.sendMail(event.id, event.stateId, 0);
        }
        else {
            this.getEvents();
        }
    };

    getEvents() {
        MainStore.getAppDispatcher().handleViewAction({
            actionType: 'GET_EVENTS',
        });
    }


    handleDeleteEvent = () => {
        const eventId = this.state.eventData.id;
        const loginUserId = this.state.user.id;
        this.setState({disableLoader: false, showPopUp: false});
        var that = this;
        jq.post({
            url: window.ajaxPrefix + "mvc/deleteEvent?loginUserId=" + loginUserId + "&eventId=" + eventId,
            type: "DELETE",
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                if (response) {
                    that.setState({disableLoader: true});
                    SMAUtils.success("Event Deleted Successfully!");
                    that.getEvents();
                }
            },

            error: function (xhr, status, err) {
                that.setState({disableLoader: true});
                if (xhr.responseJSON)
                    SMAUtils.error(xhr.responseJSON.errorMessage);

            }
        });

    };
    openPopUp = () => {
        this.setState({showPopUp: !this.state.showPopUp});
    };


    render() {
        const {disableLoader} = this.state;

        return (
            <div className='container-fluid'>
                <div className='row' style={{padding: 20}}>
                    <div className='col-10' style={{alignSelf: 'center'}}>
                        <label>
                            Total Number of Events -
                            <span>{this.state.totalNoOfEvents}</span>
                        </label>
                    </div>
                    <div className='col-2 crt-btn'>
                        <Button color='teal' icon='plus' content='Create Event' labelPosition='left'
                                onClick={this.handleCreateEvent}
                                style={{float: 'right'}}
                        />
                    </div>
                </div>
                <Divider fitted style={{margin: '0 20px'}}/>
                <Events ref='events' onEdit={this.onEditClicked} onDelete={this.onDeleteClicked}
                        setEventValues={this.setEventValues}
                        onResend={this.onResendClicked}/>

                <CreateEvent openFlag={this.state.openFlag}
                             dimmerFlag={this.state.dimmerFlag}
                             closeFlag={this.state.closeFlag}
                             closeModal={this.oncloseModal}
                             onSave={this.onEventSave}
                             eventData={this.state.eventData}
                />

                <ConfirmationPopUp onYes={this.handleDeleteEvent} headerName="Delete Event "
                                   message="This is a permanent action and cannot be undone."
                                   headerMessage="Are you sure you want to delete this Event?"
                                   textColor="#EB0F0F"
                                   isOpen={this.state.showPopUp} close={this.openPopUp}/>


                <Dimmer inverted active disabled={disableLoader} page={!disableLoader}>
                    <Loader size='huge' disabled={disableLoader} content="Loading"/>
                </Dimmer>

            </div>
        );
    }
}

