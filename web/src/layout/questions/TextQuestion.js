import React, {Component} from 'react';
import {Input, TextArea, Form} from 'semantic-ui-react';
import SMAUtils from "../../common/SMAUtils";
import MainStore from "../../MainStore";

export default class TextQuestion extends Component {

    state = {
        value: '',
        error: false,
        errorMessage: '',

    };

    componentDidMount() {
        this.mainStore = MainStore.addChangeListener(this.storeChanged);
        var value = '';
        if (this.props && this.props.answer && this.props.answer.optionValue) {
            value = this.props.answer.optionValue;
        }
        this.setState({value: value});
    }

    componentWillReceiveProps(props) {
        var value = '';
        var disabled=false;
        if (props.answer && props.answer.optionValue) {
            value = props.answer.optionValue;
        }

        this.setState({value: value,});
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
        var errorMessage = '';
        var validateOn = this.props.questionObj.validateOn;
        if (validateOn == "S") { //string
            error = SMAUtils.validateString(this.state.value, flag);
            errorMessage = error ? this.state.value.length>30000 ? "Please enter valid data.Maximum allowed characters 30000" :'Please fill valid data.' : '';

        }
        else if (validateOn == "N") { //number
            error = SMAUtils.validateNumber(this.state.value, flag);
            errorMessage = error ? parseInt(this.state.value)> 100000000?"Please enter valid data.Maximum limit 10,00,00,000": 'Please enter a valid number.' : '';
        }
        else if (validateOn == "D") { //decimal
            error = SMAUtils.validateDecimal(this.state.value, flag);
            errorMessage = error ? parseFloat(this.state.value)> 100000000?"Please enter valid data.Maximum limit 10,00,00,000": 'Please enter a valid number.' : '';
        }
        else if (validateOn == "P") { //percentage
            error = SMAUtils.validatePercentage(this.state.value, flag);
            errorMessage = error ? 'Please enter a valid percentage value.' : '';
        }
        this.setState({error: error, errorMessage});
        this.props.validateAnswer(this.props.questionObj.questionId, error);
    }

    onChangeAnswer(event, data) {
        var str= data.value;
        var error=false;
        var errorMessage='';
        if(data && data.value && data.value.length > 30000 && this.props.questionObj.validateOn == "S"){
            error=true;
            errorMessage="Please enter valid data.Maximum allowed characters 30000";
        }

        if (data && data.value && this.props.questionObj.validateOn == "N") {
            //number
            error = SMAUtils.validateNumber(data.value, false);
            errorMessage = error ? parseInt(data.value)> 100000000?"Please enter valid data.Maximum limit 10,00,00,000": 'Please enter a valid number.' : '';
        }

        if (data && data.value && this.props.questionObj.validateOn == "D") { //decimal
            error = SMAUtils.validateDecimal(data.value, false);
            errorMessage = error ? parseFloat(data.value)> 100000000?"Please enter valid data.Maximum limit 10,00,00,000": 'Please enter a valid number.' : '';
        }
        if (data && data.value && this.props.questionObj.validateOn == "P") { //percentage
            error = SMAUtils.validatePercentage(data.value, false);
            errorMessage = error ? 'Please enter a valid percentage value.' : '';
        }


        this.setState({value: str, error: error, errorMessage: errorMessage});
        const {questionObj} = this.props;
        this.props.onAnswerChange(questionObj.questionId, questionObj.options[0].optionId, str);
    }

    render() {
        const {value, error, errorMessage} = this.state;

        const {questionObj, reportView, disabled, first, last} = this.props;

        const disable = disabled === true;

        var input = (
            <Input onChange={this.onChangeAnswer.bind(this)} value={value} error={error} disabled={disable}
                   style={disable ? {opacity: 100} : {}}/>
        );

        if (questionObj && questionObj.validateOn && questionObj.validateOn == "S") {
            var errorStyle = {width: '100%'};
            if (disable)
                errorStyle.opacity = 100;

            if (error) {
                errorStyle = {background: '#FFF6F6', borderColor: '#E0B4B4', width: '100%'};
            }

            input = (
                <Form>
                    <TextArea onChange={this.onChangeAnswer.bind(this)}
                              value={value}
                              disabled={disable}
                              style={errorStyle}
                    />
                </Form>
            );
        }

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
                        {input}
                    </div>
                    <p className='imp'>{errorMessage}</p>
                    {last ? '' : <div className="hr-dotted"></div>}
                </div>
            );
        }

        return (
            <div className="text-ques">
                <div className="question">
                    {questionObj.sno}. {questionObj.question}
                </div>
                <div className="ans-space">
                    {input}
                </div>
                <p className='imp'>{errorMessage}</p>
                <div className={"hr-dotted"}></div>
            </div>
        );
    }
}
