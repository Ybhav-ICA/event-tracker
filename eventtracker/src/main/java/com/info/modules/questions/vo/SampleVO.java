package com.info.modules.questions.vo;

import java.util.List;

public class SampleVO {
    private List<QuestionsVO> questions;
    private List<AnswersVO> answers;
    private RegionAccessValidationVO validation;
    private EventFormStatusVO event;

    public EventFormStatusVO getEvent() {
        return event;
    }

    public void setEvent(EventFormStatusVO event) {
        this.event = event;
    }

    public RegionAccessValidationVO getValidation() {
        return validation;
    }

    public void setValidation(RegionAccessValidationVO validation) {
        this.validation = validation;
    }

    public List<QuestionsVO> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionsVO> questions) {
        this.questions = questions;
    }

    public List<AnswersVO> getAnswers() {
        return answers;
    }

    public void setAnswers(List<AnswersVO> answers) {
        this.answers = answers;
    }
}
