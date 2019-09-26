package com.info.modules.questions.vo;

import java.util.List;

public class QuestionsVO {
    private Long questionId;
    private String question;
    private Long optionTypeId;
    private List<OptionsVO> options;
    private String validateOn;

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public Long getOptionTypeId() {
        return optionTypeId;
    }

    public void setOptionTypeId(Long optionTypeId) {
        this.optionTypeId = optionTypeId;
    }

    public List<OptionsVO> getOptions() {
        return options;
    }

    public void setOptions(List<OptionsVO> options) {
        this.options = options;
    }

    public String getValidateOn() {
        return validateOn;
    }

    public void setValidateOn(String validateOn) {
        this.validateOn = validateOn;
    }
}
