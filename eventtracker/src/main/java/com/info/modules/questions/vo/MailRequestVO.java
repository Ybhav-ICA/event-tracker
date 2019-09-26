package com.info.modules.questions.vo;

public class MailRequestVO {
    private Long requestId1;
    private String userName;
    private String emailId;
    private Long userId;
    private Long requestId2;
    private String templateName1;
    private String templateName2;


    public String getTemplateName1() {
        return templateName1;
    }

    public void setTemplateName1(String templateName1) {
        this.templateName1 = templateName1;
    }

    public String getTemplateName2() {
        return templateName2;
    }

    public void setTemplateName2(String templateName2) {
        this.templateName2 = templateName2;
    }

    public Long getRequestId1() {
        return requestId1;
    }

    public void setRequestId1(Long requestId1) {
        this.requestId1 = requestId1;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmailId() {
        return emailId;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getRequestId2() {
        return requestId2;
    }

    public void setRequestId2(Long requestId2) {
        this.requestId2 = requestId2;
    }
}
