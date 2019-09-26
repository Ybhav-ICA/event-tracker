import React, {Component} from 'react';
import { Divider } from 'semantic-ui-react'
const moment = require('moment');

export default class EventRenderer extends Component {

    state = {

        event: {},
        userId: 1,
        formId: 1
    };

    componentDidMount() {

    }

    render() {

        var event = this.props.data;
        var dateObj = '';
        var date = '';
        var time = '';
        if (event && event.date) {
            dateObj = moment(event.date).format("DD-MM-YYYY hh:mm a");
            var dateObjArr = dateObj.split(" ");
            date = dateObjArr[0];
            time = dateObjArr[1] + ' ' + dateObjArr[2].toUpperCase();
        }

        return (
            <div>
                <div style={{display: 'flex',justifyContent:'space-between', padding:'20px 40px 10px 40px'}}>
                    <div className="evt-flex-col">
                        <label className="evnt-head">Event Name</label>
                        <label className="evnt-tail">{event.eventName}</label>
                    </div>
                    <div className="evt-flex-col">
                        <label className="evnt-head">Date</label>
                        <label className="evnt-tail">{date}</label>
                    </div>
                    <div className="evt-flex-col">
                        <label className="evnt-head">Time</label>
                        <label className="evnt-tail">{time}</label>
                    </div>
                    <div className="evt-flex-col">
                        <label className="evnt-head">Role</label>
                        <label className="evnt-tail">{event.role}</label>
                    </div>
                    <div className="evt-flex-col">
                        <label className="evnt-head">Leader's Name</label>
                        <label className="evnt-tail">{event.leaderName}</label>
                    </div>
                    <div className="evt-flex-col">
                        <label className="evnt-head">Parliament Constituency</label>
                        <label className="evnt-tail">{event.parliament}</label>
                    </div>
                    <div className="evt-flex-col">
                        <label className="evnt-head">State</label>
                        <label className="evnt-tail">{event.state}</label>
                    </div>
                </div>
               <div className={"ques-dotted"} ></div>
            </div>
        );
    }
}



/*<div className="evt-flex-col">
                        <label className="evnt-head">Status</label>
                        <label className="evnt-tail">{event.eventStatus == "P" ? "Open" : "Close"}</label>
                    </div>*/

