import React, {Component} from 'react';
import {Button, Loader, Dimmer, Icon, Divider} from 'semantic-ui-react';
import SMAUtils from "../../common/SMAUtils";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const moment = require('moment');
const jq = window.$;

class Downloads extends Component {

    state = {
        buttons: [],
        loaderDisable: true,
        endDate: '',
        startDate: '',
    };

    componentDidMount() {
        const user = JSON.parse(sessionStorage.user);
        this.state.user = user;
        var d = new Date();
        var endDate = d.setDate(d.getDate());
        var startDate = d.setDate(d.getDate() - 30);
        this.setState({startDate: moment(startDate), endDate: moment(endDate)});
        this.init();
    }

    init() {
        this.setState({loaderDisable: false});
        var that = this;
        jq.ajax({
            url: window.ajaxPrefix + "mvc/getDownloads?userId=" + this.state.user.id + "&roleId=" + this.state.user.roleId,
            type: "GET",
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                that.setState({loaderDisable: true, buttons: response});
            },
            error: function (xhr, status, err) {
                that.setState({loaderDisable: true});
                if (xhr.responseJSON)
                    SMAUtils.error(xhr.responseJSON.errorMessage);
            }
        });
    }

    onButtonClick(btn) {
        this.makeSPCall(btn);
    }

    makeSPCall(btn) {
        if (this.state.startDate != '' && this.state.endDate != '') {
            const that = this;
            var startDateMS = moment(this.state.startDate).startOf('day').valueOf();
            var endDateMS = moment(this.state.endDate).startOf('day').valueOf();
            if (startDateMS <= endDateMS) {
                this.setState({loaderDisable: false});
                var startDate = moment(this.state.startDate).format("YYYY-MM-DD");
                var endDate = moment(this.state.endDate).format("YYYY-MM-DD");

                jq.ajax({
                    url: window.ajaxPrefix + "mvc/generateExport?exportId=" + btn.id + "&userId=" + this.state.user.id + "&startDate=" + startDate + "&endDate=" + endDate,
                    type: "GET",
                    dataType: "json",
                    contentType: 'application/json; charset=utf-8',
                    success: function (response) {
                        var fileId = response;
                        window.open(window.ajaxPrefix + "mvc/downloadFile?fileId=" + fileId, '_blank');
                        that.setState({loaderDisable: true});
                    },
                    error: function (xhr, status, err) {
                        that.setState({loaderDisable: true});
                        if (xhr.responseJSON)
                            SMAUtils.error(xhr.responseJSON.errorMessage);
                    }
                });

            } else {
                SMAUtils.error("StartDate is greater than EndDate");
            }
        } else {
            SMAUtils.warning("Please fill dates field(s)");
        }
    }

    onChangeStartDate(date) {
        this.setState({startDate: date});
    }

    onChangeEndDate(date) {
        this.setState({endDate: date});
    }

    render() {
        var buttonsUI = [];
        for (var btnIndex in this.state.buttons) {
            var btn = this.state.buttons[btnIndex];
            buttonsUI.push(
                <div key={btnIndex} className='download-list'>
                    <div className='report-name'>{btn.exportName}</div>
                    <div className='bold-button'>
                        <Button
                            icon='download'
                            labelPosition='left'
                            color='orange'
                            content="Download"
                            onClick={this.onButtonClick.bind(this, btn)}
                        />
                    </div>
                </div>
            );
        }

        return (
            <div id='downloads'>
                <div className='download-header'>
                    <div>
                        <label>Download Reports</label>
                    </div>
                    <p className="date_label">Start Date:</p>
                    <div className="selectionStartDate ">
                        <DatePicker dateFormat="DD/MM/YYYY" className="startDatePickr"
                                    selected={this.state.startDate}
                                    onChange={this.onChangeStartDate.bind(this)}
                                    todayButton={"Start Date"}
                                    placeholderText="Start Date"
                        /><Icon name="calendar" color="teal"/>
                    </div>
                    <p className="date_label date_divider" style={{paddingLeft: '10px'}}>End Date:</p>
                    <div className="selectionEndDate">
                        <DatePicker dateFormat="DD/MM/YYYY" className="endDatePickr" selected={this.state.endDate}
                                    onChange={this.onChangeEndDate.bind(this)} todayButton={"End Date"}
                                    placeholderText="End Date"
                        /><Icon name="calendar" color="teal"/>
                    </div>
                </div>

                <Divider fitted/>

                <div style={{paddingTop: 15}}>
                    {buttonsUI}
                </div>

                <Dimmer inverted active disabled={this.state.loaderDisable} page={!this.state.loaderDisable}>
                    <Loader size='huge' disabled={this.state.loaderDisable} content="loading"/>
                </Dimmer>
            </div>
        );
    }

}

export default Downloads;
