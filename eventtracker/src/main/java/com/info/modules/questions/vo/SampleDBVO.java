package com.info.modules.questions.vo;

import java.util.List;

public class SampleDBVO {
    private RegionAccessValidationVO validation;
    private EventFormStatusVO event;
    private QuestionTemplateVersionVO questionTemplate;
    private List<QuestionsDBVO> questions;


    public RegionAccessValidationVO getValidation() {
        return validation;
    }

    public void setValidation(RegionAccessValidationVO validation) {
        this.validation = validation;
    }

    public EventFormStatusVO getEvent() {
        return event;
    }

    public void setEvent(EventFormStatusVO event) {
        this.event = event;
    }

    public QuestionTemplateVersionVO getQuestionTemplate() {
        return questionTemplate;
    }

    public void setQuestionTemplate(QuestionTemplateVersionVO questionTemplate) {
        this.questionTemplate = questionTemplate;
    }

    public List<QuestionsDBVO> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionsDBVO> questions) {
        this.questions = questions;
    }
}
