package com.info.modules.questions.vo;

public class QuestionsDBVO {
    private Long questionId;
    private String question;
    private Long optionTypeId;
    private Long optionId;
    private String option;
    private String validateOn;
    private String choosenOptionValue;
    private Long choosenOptionId;

    public String getChoosenOptionValue() {
        return choosenOptionValue;
    }

    public void setChoosenOptionValue(String choosenOptionValue) {
        this.choosenOptionValue = choosenOptionValue;
    }

    public Long getChoosenOptionId() {
        return choosenOptionId;
    }

    public void setChoosenOptionId(Long choosenOptionId) {
        this.choosenOptionId = choosenOptionId;
    }

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

    public Long getOptionId() {
        return optionId;
    }

    public void setOptionId(Long optionId) {
        this.optionId = optionId;
    }

    public String getOption() {
        return option;
    }

    public void setOption(String option) {
        this.option = option;
    }

    public String getValidateOn() {
        return validateOn;
    }

    public void setValidateOn(String validateOn) {
        this.validateOn = validateOn;
    }
}
