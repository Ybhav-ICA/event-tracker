package com.info.modules.questions.vo;

public class AnswersVO {
    private Long questionId;
    private Long optionId;
    private String optionValue;

    public AnswersVO() {
    }

    public AnswersVO(Long questionId, Long optionId, String optionValue) {
        this.questionId = questionId;
        this.optionId = optionId;
        this.optionValue = optionValue;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public Long getOptionId() {
        return optionId;
    }

    public void setOptionId(Long optionId) {
        this.optionId = optionId;
    }

    public String getOptionValue() {
        return optionValue;
    }

    public void setOptionValue(String optionValue) {
        this.optionValue = optionValue;
    }
}
