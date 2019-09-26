package com.info.modules.questions.vo;

public class OptionsVO {
    private String option;
    private Long optionId;

    public OptionsVO() {
    }

    public OptionsVO(String option, Long optionId) {
        this.option = option;
        this.optionId = optionId;
    }

    public String getOption() {
        return option;
    }

    public void setOption(String option) {
        this.option = option;
    }

    public Long getOptionId() {
        return optionId;
    }

    public void setOptionId(Long optionId) {
        this.optionId = optionId;
    }
}
