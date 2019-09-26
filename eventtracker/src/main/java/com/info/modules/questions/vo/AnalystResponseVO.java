package com.info.modules.questions.vo;

import java.util.List;

public class AnalystResponseVO {
    private List<FormDBVO> forms;
    private SampleVO questions;

    public List<FormDBVO> getForms() {
        return forms;
    }

    public void setForms(List<FormDBVO> forms) {
        this.forms = forms;
    }

    public SampleVO getQuestions() {
        return questions;
    }

    public void setQuestions(SampleVO questions) {
        this.questions = questions;
    }
}
