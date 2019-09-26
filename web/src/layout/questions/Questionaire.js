import React, {Component} from 'react';
import TextQuestion from "./TextQuestion";
import DropdownQuestion from "./DropdownQuestion";
import EventRenderer from "./EventRenderer";
import {Loader, Dimmer, Button} from 'semantic-ui-react';
import _ from 'underscore';
import MainStore from "../../MainStore";
import SMAUtils from "../../common/SMAUtils";

var jq = window.$;

export default class Questionaire extends Component {

    state = {
        questions: [],
        disableLoader: true,
        userId: 0,
        answers: [],
        validationFailed: false,
        errors: [],
        validatedQuestionsCount: 0,
        event: {},
        version: '',
        requestId: 0, msg: '',
        msgStatus:0,
        questionsRes:[]

    };

    componentDidMount() {
        var params = new URLSearchParams(document.location.search);
        var requestId = params.get("requestId");
        var userId = params.get("userId");
        if (requestId && userId) {
            this.state.requestId = requestId;
            this.state.userId = userId;
            this.getQuestions();
        }
    }


    getQuestions() {
        this.setState({disableLoader: false, msg: ''});
        var that = this;
        jq.ajax({
            url: window.ajaxPrefix + "mvc/getSample?requestId=" + this.state.requestId,
            type: "GET",
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (response, status, request) {
                that.setState({disableLoader: true});

                if (response && response.validation && (response.validation.status == 1 ||response.validation.status == 0)) {
                    if (response.questions && response.questions.length > 0) {
                        that.state.answers = response.answers;
                        that.state.questionsRes=response.questions;
                        var version = '';
                        if (response.event && response.event.requestVersion) {
                            version = response.event.requestVersion;
                        }
                        that.setState({event: response.event, version: version, msg: response.validation.message,
                            msgStatus:response.validation.status});
                        that.buildQuestions(response.questions, response.answers);
                    }
                    if(response.validation.status == 0){
                        SMAUtils.warning(response.validation.message);
                    }
                } else {
                    if (response.validation && response.validation.message) {
                        SMAUtils.warning(response.validation.message);
                        that.setState({msg: response.validation.message})
                    }
                }
            },
            error: function (xhr, status, err) {
                that.setState({disableLoader: true});
                if (xhr.responseJSON)
                    SMAUtils.error(xhr.responseJSON.errorMessage);
            }
        });
    }

    onAnswerChange(questionId, optionId, optionValue) {
        var index = _.findIndex(this.state.answers, {questionId: questionId});
        var newAnswer = {};
        newAnswer.questionId = questionId;
        newAnswer.optionId = optionId;
        newAnswer.optionValue = optionValue;
        this.state.answers[index] = newAnswer;
    }


    buildQuestions(res, answers) {
        var questions = [];
        for (var i = 0; i < res.length; i++) {
            var question = res[i];
            var answer = _.findWhere(answers, {questionId: res[i].questionId});
            if (question.optionTypeId == 1) {
                question.sno = i + 1;
                questions.push(<TextQuestion questionObj={question} answer={answer} disabled={this.state.msgStatus === 0?true:false}
                                             validateAnswer={this.validateAnswer.bind(this)}
                                             onAnswerChange={this.onAnswerChange.bind(this)}/>)
            } else if (question.optionTypeId == 2) {
                question.sno = i + 1;
                questions.push(<DropdownQuestion questionObj={question} answer={answer} disabled={this.state.msgStatus === 0?true:false}
                                                 validateAnswer={this.validateAnswer.bind(this)}
                                                 onAnswerChange={this.onAnswerChange.bind(this)}/>)
            }
        }
        this.setState({questions: questions});
    }

    validateAnswer(qId, error) {
        this.state.validatedQuestionsCount += 1;
        if (error) {
            this.state.errors.push(qId);
        }
        if (this.state.validatedQuestionsCount == this.state.questions.length) {
            if (this.state.errors.length == 0) {
                var flag = 0;
                if (MainStore.getMandatoryCheck()) {
                    flag = 1;
                }
                this.saveSample(flag);
            } else {
                SMAUtils.warning("Please fill fields properly");
            }
        }
    }


    saveSample(flag) {
        this.setState({disableLoader: false});
        var that = this;
        jq.ajax({
            url: window.ajaxPrefix + "mvc/onSaveSample?requestId=" + this.state.requestId + "&version=" + this.state.version + "&submitFlag=" + flag,
            type: "POST",
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(that.state.answers),
            success: function (response, status, request) {
                that.setState({disableLoader: true});

                if (response && response.status == 1) {
                    var msg = "";
                    if (flag) {
                        msg = "Form is Successfully Submitted";
                        that.setState({msg: msg,msgStatus:0});
                        that.buildQuestions(that.state.questionsRes, that.state.answers);
                    } else {
                        msg = "Changes  Saved Successfully";
                        that.getQuestions();
                    }
                    SMAUtils.success(msg);
                } else {
                    SMAUtils.warning(response.message);
                }

            },
            error: function (xhr, status, err) {
                that.setState({disableLoader: true})
            }
        });
    }

    onSubmitForm() {
        this.state.validatedQuestionsCount = 0;
        this.state.errors = [];
        MainStore.getAppDispatcher().handleViewAction({
            actionType: 'ON_FORM_SUBMIT',
            mandatoryCheck: true,
        });
    }

    onSaveForm() {
        this.state.validatedQuestionsCount = 0;
        this.state.errors = [];
        MainStore.getAppDispatcher().handleViewAction({
            actionType: 'ON_FORM_SUBMIT',
            mandatoryCheck: false,
        });
    }

    render() {
        let st = this.state;
        var displayItems;
        if (st.questions && st.questions.length > 0 ) {
            var buttonEnable;
            var formMessage;
            if (st.msgStatus === 1){
                buttonEnable=<div className="btns">
                    <Button primary onClick={this.onSaveForm.bind(this)}>Save</Button>
                    <Button color='orange' onClick={this.onSubmitForm.bind(this)}>Submit</Button>
                </div>;
                formMessage='';

            }else {
                formMessage=<div className="msg-banner-head">{st.msg}</div>
            }
            displayItems = (
                <div className="quesionaire">
                    {formMessage}
                    <EventRenderer data={st.event}/>
                    <div className="ques-main">
                        <div style={{marginBottom: 30}}>
                            <label className="evnt-head" style={{marginRight: 10}}>
                                Event Input for :
                            </label>
                            <label className="evnt-tail">{st.event.templateName}</label>
                        </div>
                        {st.questions}
                    </div>
                    {buttonEnable}
                </div>
            );
        } else {
            displayItems = <div className="msg-banner">{st.msg}</div>
        }

        return (
            <div id='questionare'>
                <div className="header-main-style">
                    <img className="header-logo" alt=""/>
                    <label className="evnt-tk-lb">Event tracker</label>
                </div>
                {displayItems}
                <Dimmer inverted active disabled={this.state.disableLoader} page={!this.state.disableLoader}>
                    <Loader size='huge' disabled={this.state.disableLoader} content="Loading"/>
                </Dimmer>
            </div>
        );
    }
}

