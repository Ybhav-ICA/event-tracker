import React, {Component} from 'react';
import {Dropdown} from 'semantic-ui-react'
import SMAUtils from "../../common/SMAUtils";
import MainStore from "../../MainStore";
import _ from 'underscore';

export default class DropdownQuestion extends Component {

    state = {
        options: [],
        value: '',
        error: false
    };

    componentDidMount() {
        this.mainStore = MainStore.addChangeListener(this.storeChanged);
        var options = SMAUtils.buildOptions(this.props.questionObj.options);
        var value = '';
        if (this.props && this.props.answer && this.props.answer.optionId) {
            value = this.props.answer.optionId;
        }
        this.setState({options: options, value: value});
    }

    componentWillReceiveProps(props) {
        var options = SMAUtils.buildOptions(props.questionObj.options);
        var value = '';
        if (props.answer && props.answer.optionId) {
            value = props.answer.optionId;
        }
        this.setState({options: options, value: value});
    }

    componentWillUnmount() {
        if (this.mainStore)
            this.mainStore.remove();
    }

    storeChanged = (actionType, defaultActionType) => {
        const {disabled} = this.props;
        if (actionType === 'ON_FORM_SUBMIT') {
            const flag = MainStore.getMandatoryCheck();
            this.validateAnswer(flag);
        }
        if (actionType === 'SUBMIT_REPORT' && !disabled) {
            const flag = MainStore.getMandatoryCheck();
            this.validateAnswer(flag);
        }
    };

    validateAnswer(flag) {
        var error = false;
        if (SMAUtils.validateMandatoryFieldDropdown(this.state.value) && flag) {
            error = true;
        }
        this.setState({error: error});
        this.props.validateAnswer(this.props.questionObj.questionId, error)
    }

    getOptionValue(id) {
        const option = _.findWhere(this.state.options, {id: parseInt(id)});
        return option ? option.text : '';
    }

    onAnswerChange(event, data) {
        this.setState({value: data.value, error: false});
        this.props.onAnswerChange(
            this.props.questionObj.questionId,
            data.value,
            this.getOptionValue(data.value)
        );
    }

    render() {
        const {options, value, error} = this.state;
        const {questionObj, reportView, disabled, first, last} = this.props;

        const disable = disabled === true;

        const dropDown = (
            <Dropdown
                selection options={options}
                onChange={this.onAnswerChange.bind(this)}
                value={value} error={error}
                selectOnBlur={false}
                disabled={disable}
                style={disable ? {opacity: 100} : {}}
            />
        );

        var style = {
            paddingTop: first ? 25 : 0,
            borderBottom: last ? '1px solid #CECACA' : 'none'
        };
        if (disable) {
            style = {
                marginRight: 5,
                ...style,
            }
        }
        else {
            style = {
                marginLeft: 5,
                ...style,
            }
        }

        if (reportView) {
            return (
                <div className='ques-col' style={style}>
                    <div className="question">
                        {questionObj.sno}. {questionObj.question}
                    </div>
                    <div className="ans-space">
                        {dropDown}
                    </div>
                    <div className={"hr-dotted"}></div>
                </div>
            );
        }

        return (
            <div className="dd-ques">
                <div className="question">
                    {questionObj.sno}. {questionObj.question}
                </div>
                <div className="ans-space">
                    {dropDown}
                </div>
                <div className={"hr-dotted"}></div>
            </div>
        );
    }
}

