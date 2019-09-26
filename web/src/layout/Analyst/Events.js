import React, {Component} from 'react';
import './Analyst.css';
import EventsList from "./EventsList";
import {Dimmer, Loader} from 'semantic-ui-react';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import Pagination from 'react-js-pagination';
import SMAUtils from "../../common/SMAUtils";
import ReportsConsolidation from "./ReportsConsolidation";
import _ from 'underscore';
import MainStore from "../../MainStore";

const jq = window.$;

export default class Events extends Component {
    state = {
        user: {},
        events: [],
        disableLoader: true,
        activePage: 1,
        totalItemsCount: 0,
        itemsPerPage: 20,
        editComments: false,
        selectedEvent: {}
    };

    componentDidMount() {
        this.mainStore = MainStore.addChangeListener(this.storeChanged);
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (user) {
            this.state.user = user;
            this.fetchEvents();
        }
    }

    componentWillUnmount() {
        if (this.mainStore)
            this.mainStore.remove();
    }

    storeChanged = (actionType, defaultActionType) => {
        if (actionType === 'GET_EVENTS') {
            this.fetchEvents();
        }
    };

    fetchEvents = () => {
        this.setState({disableLoader: false});
        const {user, itemsPerPage, activePage} = this.state;
        const that = this;
        jq.ajax({
            url: window.ajaxPrefix + `mvc/events?userId=${user.id}&pageNumber=${activePage}&pageSize=${itemsPerPage}`,
            type: "GET",
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                that.setState({disableLoader: true});
                if (response && response.length > 0) {
                    that.setState({events: response, totalItemsCount: response[0].totalEvents});
                    if (that.props.setEventValues) {
                        that.props.setEventValues(response[0].totalEvents, response[0].pendingEvents, response[0].completedEvents);
                    }
                }
                else {
                    that.setState({events: [], totalItemsCount: 0});
                    if (that.props.setEventValues) {
                        that.props.setEventValues(0, 0, 0);
                    }
                }
            },
            error: function (xhr, status, err) {
                that.setState({disableLoader: true});
                if (xhr.responseJSON)
                    SMAUtils.error(xhr.responseJSON.errorMessage);
            }
        });
    };

    onSliderPageChangeValue = (event) => {
        this.state.itemsPerPage = event.target.value;
        this.fetchEvents();
    };

    updatePageSizeUI = (event) => {
        this.setState({itemsPerPage: event.target.value});
    };

    handlePageChange = (event, data) => {
        this.state.activePage = event;
        this.fetchEvents();
    };

    getEventById(eventId) {
        const event = _.findWhere(this.state.events, {id: parseInt(eventId)});
        return event ? event : {};
    }

    onAddComments = (eventId) => {
        const selectedEvent = this.getEventById(eventId);
        this.storeEvent(selectedEvent);
        this.setState({
            editComments: true,
            selectedEvent
        });
    };

    onPrintClick = (eventId) => {
        const selectedEvent = this.getEventById(eventId);
        this.storeEvent(selectedEvent);
        MainStore.getAppDispatcher().handleViewAction({
            actionType: 'TOGGLE_HEADER',
            displayHeader: false,
        });
        window.route('Print');
    };

    storeEvent(selectedEvent) {
        MainStore.getAppDispatcher().handleViewAction({
            actionType: 'STORE_EVENT',
            event: selectedEvent,
        });
    }

    onBack = () => {
        this.setState({editComments: false, selectedEvent: {}});
        this.fetchEvents();
    };

    onEdit = (event) => {
        this.props.onEdit(event);
    };

    onDelete = (event) => {
        this.props.onDelete(event);
    };

    onResend = (event) => {
        this.props.onResend(event);
    };

    render() {
        const {
            events,
            disableLoader,
            activePage,
            itemsPerPage,
            totalItemsCount,
            editComments,
            selectedEvent
        } = this.state;


        if (editComments) {
            const editProps = {
                selectedEvent
            };

            return (
                <ReportsConsolidation {...editProps} onBack={this.onBack}/>
            );
        }
        else {
            const eventProps = {
                events,
                onEdit: this.onEdit,
                onDelete: this.onDelete,
                onResend: this.onResend,
            };

            return (
                <div id="events">
                    <div className="table-header container-fluid">
                        <div className='row'>
                            <div className='col-lg-4 col-xl-5 col-md-3'>
                                <h3>List of Events</h3>
                            </div>
                            <div className='col-lg-4 col-xl-4 col-md-5 bs-slider-div'>
                                <span>Records per Page: {itemsPerPage}</span>
                                <div className="bs-slider">
                                    <ReactBootstrapSlider
                                        step={5}
                                        max={200}
                                        min={10}
                                        orientation="horizontal"
                                        tooltip="hide"
                                        value={itemsPerPage}
                                        change={this.updatePageSizeUI}
                                        slideStop={this.onSliderPageChangeValue}
                                    />
                                </div>
                            </div>
                            <div className='col-lg-4 col-xl-3 col-md-4'>
                                {
                                    totalItemsCount > itemsPerPage ?
                                        <Pagination
                                            prevPageText='prev'
                                            nextPageText='next'
                                            firstPageText='first'
                                            lastPageText='last'
                                            pageRangeDisplayed={4}
                                            activePage={activePage}
                                            itemsCountPerPage={itemsPerPage}
                                            totalItemsCount={totalItemsCount}
                                            onChange={this.handlePageChange}
                                        /> :
                                        <div></div>
                                }
                            </div>
                        </div>
                    </div>

                    <EventsList {...eventProps} onAddComments={this.onAddComments} onPrintClick={this.onPrintClick}/>

                    <Dimmer inverted active disabled={disableLoader} page={!disableLoader}>
                        <Loader size='huge' disabled={disableLoader} content="Loading"/>
                    </Dimmer>
                </div>
            );
        }
    }
}
