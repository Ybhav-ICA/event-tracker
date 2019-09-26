import React, {Component} from 'react';
import './Analyst.css';
import {Dimmer, Loader, Icon, Button} from 'semantic-ui-react';
import SMAUtils from "../../common/SMAUtils";
import EventRenderer from "../questions/EventRenderer";
import _ from 'underscore';
import DropdownQuestion from "../questions/DropdownQuestion";
import TextQuestion from "../questions/TextQuestion";
import MainStore from "../../MainStore";

const jq = window.$;

export default class ReportsConsolidation extends Component {

    state = {
        user: {},
        questions: [],
        forms: [],
        disableLoader: true,
        selectedEvent: {},
        formNames: [],
        reportForm: [],
        answers: [],
        validatedQuestionsCount: 0,
        errors: [],
        activeItem: ''
    };

    componentDidMount() {
        const user = JSON.parse(sessionStorage.getItem('user'));
        const {selectedEvent} = this.props;
        if (user) {
            this.state.user = user;
            this.state.selectedEvent = selectedEvent;
            this.fetchQuestions();
        }
    }

    fetchQuestions = () => {
        this.setState({disableLoader: false});
        const {user, selectedEvent} = this.state;
        const that = this;
        jq.ajax({
            url: window.ajaxPrefix + `mvc/submittedForms?userId=${user.id}&eventId=${selectedEvent.id}`,
            type: "GET",
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                that.setState({disableLoader: true});
                if (response && response.forms && response.forms.length > 0) {
                    that.state.questions = response.questions.questions;
                    that.state.answers = response.questions.answers;
                    that.setFormNames(response.forms);
                }
                else {
                    SMAUtils.warning("No Users assigned.");
                }
            },
            error: function (xhr, status, err) {
                that.setState({disableLoader: true});
                if (xhr.responseJSON)
                    SMAUtils.error(xhr.responseJSON.errorMessage);
            }
        });
    };

    setFormNames(response) {
        var formNames = [];
        var forms = {};
        if (response) {
            const uniqForms = _.uniq(response, (value) => {
                return value.templateId;
            });
            if (uniqForms && uniqForms.length > 0) {
                for (var i = 0; i < uniqForms.length; i++) {
                    const _formId = uniqForms[i].templateId;
                    formNames.push({
                        id: _formId,
                        name: uniqForms[i].templateName,
                    });

                    forms[_formId] = this.buildQuestions(response, _formId);
                }
                formNames = _.sortBy(formNames, 'id');
            }
        }
        this.state.formNames = formNames;
        this.state.forms = forms;
        var formId;
        if (formNames.length > 0) {
            formId = formNames[0].id;
        }
        this.state.activeItem = formId;
        this.buildReportForm(formId);
    }

    buildQuestions(data, formId) {
        const res = _.where(data, {templateId: parseInt(formId)});
        var questions = [];
        var questionMap = {};
        for (var i = 0; i < res.length; i++) {
            const q = res[i];
            const option = {
                option: q.option,
                optionId: q.optionId,
            };
            if (questionMap[q.questionId]) {
                questionMap[q.questionId].options.push(option);
            }
            else {
                q.options = [option];
                questions.push(q);
                questionMap[q.questionId] = q;
            }
        }
        return questions;
    }

    buildReportForm(formId) {
        this.state.reportForm = [];
        const {questions, answers} = this.state;
        var reportForm = [];
        if (questions && questions.length > 0) {
            const formQuestions = formId ? this.state.forms[formId] : [];
            for (var i = 0; i < questions.length; i++) {
                const question = questions[i];
                const answer = _.findWhere(answers, {questionId: question.questionId});

                const props = {
                    validateAnswer: this.validateAnswer,
                    onAnswerChange: this.onAnswerChange,
                    reportView: true,
                    first: i === 0,
                    last: i === questions.length - 1,
                };

                var formQuestion = {};
                if (formId) {
                    formQuestion = formQuestions[i];
                    formQuestion.sno = i + 1;
                }
                question.sno = i + 1;

                const leftProps = {
                    questionObj: formQuestion,
                    answer: {
                        questionId: formQuestion.questionId,
                        optionId: formQuestion.choosenOptionId,
                        optionValue: formQuestion.choosenOptionValue,
                    },
                    disabled: true,
                    ...props
                };

                const rightProps = {
                    questionObj: question,
                    answer,
                    ...props
                };

                if (question.optionTypeId == 1) {
                    reportForm.push(
                        <div key={i} className='ques-row'>
                            {formId ? <TextQuestion {...leftProps}/> : <div className='col-6'></div>}
                            <TextQuestion {...rightProps}/>
                        </div>
                    );
                }
                else if (question.optionTypeId == 2) {
                    reportForm.push(
                        <div key={i} className='ques-row'>
                            {formId ? <DropdownQuestion {...leftProps}/> : <div className='col-6'></div>}
                            <DropdownQuestion {...rightProps}/>
                        </div>
                    );
                }
            }
        }
        this.setState({reportForm});
    }

    onAnswerChange = (questionId, optionId, optionValue) => {
        var index = _.findIndex(this.state.answers, {questionId: questionId});
        var newAnswer = {};
        newAnswer.questionId = questionId;
        newAnswer.optionId = optionId;
        newAnswer.optionValue = optionValue;
        this.state.answers[index] = newAnswer;
    };

    validateAnswer = (qId, error) => {
        this.state.validatedQuestionsCount += 1;
        const {questions, errors} = this.state;
        if (error) {
            this.state.errors.push(qId);
        }
        if (this.state.validatedQuestionsCount == questions.length) {
            if (errors.length == 0) {
                this.saveReport();
            }
            else {
                SMAUtils.warning("Please fill fields properly.");
            }
        }
    };

    onTabClick = (event) => {
        const id = event.target.id;
        this.state.activeItem = id;
        this.buildReportForm(id);
    };

    onBack = () => {
        this.props.onBack();
    };

    onSubmit = () => {
        this.state.validatedQuestionsCount = 0;
        this.state.errors = [];
        MainStore.getAppDispatcher().handleViewAction({
            actionType: 'SUBMIT_REPORT',
            mandatoryCheck: false,
        });
    };

    saveReport() {
        this.setState({disableLoader: false});
        const {user, selectedEvent, answers} = this.state;
        const that = this;
        jq.ajax({
            url: window.ajaxPrefix + `mvc/saveReport?userId=${user.id}&eventId=${selectedEvent.id}`,
            type: "POST",
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(answers),
            success: function (response) {
                that.setState({disableLoader: true});
                if (response) {
                    SMAUtils.success("Changes saved successfully.");
                }
            },
            error: function (xhr, status, err) {
                that.setState({disableLoader: true});
                if (xhr.responseJSON)
                    SMAUtils.error(xhr.responseJSON.errorMessage);
            }
        });
    }

    onPrint = () => {
        SMAUtils.removeToastr();
        MainStore.getAppDispatcher().handleViewAction({
            actionType: 'TOGGLE_HEADER',
            displayHeader: false,
        });
        window.route('Print');
    };

    render() {
        const {
            formNames,
            disableLoader,
            selectedEvent,
            reportForm,
            activeItem
        } = this.state;

        var formHeaders = [];
        if (formNames && formNames.length > 0) {
            for (var i = 0; i < formNames.length; i++) {
                const form = formNames[i];
                formHeaders.push(
                    <label
                        key={i}
                        id={form.id}
                        onClick={this.onTabClick}
                        className={activeItem == form.id ? 'active-label col-3' : 'col-3'}
                    >
                        {form.name.toUpperCase()}
                    </label>
                );
            }
        }

        return (
            <div id="cnsldt-report">
                <div className='report-back' onClick={this.onBack}>
                    <Icon name='chevron left'/>
                    <label>Back to List of Events</label>
                </div>
                <div>
                    <EventRenderer data={selectedEvent}/>
                </div>

                {
                    formHeaders.length > 0 ?
                        <div className='reports container-fluid'>
                            <div className='row reports-header'>
                                <h3 className='col-xl-8 col-lg-7 col-md-7 .col-sm-6'>Reports & Analyst Comments</h3>
                                <div className='col-xl-4 col-lg-5 col-md-5 .col-sm-6 bold-button'>
                                    <Button primary content='Save' onClick={this.onSubmit}/>
                                    <Button color='teal' content='Print' onClick={this.onPrint}/>
                                </div>
                            </div>

                            <div className='cmnts-header'>
                                <div className='cmnts-hdr-left'>
                                    {formHeaders}
                                </div>
                                <div className='cmnts-hdr-right'>
                                    <label>Analyst Comments</label>
                                </div>
                            </div>

                            {reportForm}
                        </div>
                        : ''
                }

                <Dimmer inverted active disabled={disableLoader} page={!disableLoader}>
                    <Loader size='huge' disabled={disableLoader} content="Loading"/>
                </Dimmer>
            </div>
        );
    }
}
