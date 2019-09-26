package com.info.modules.admin.vo;

import java.sql.Timestamp;
import java.util.List;

public class EventVO {
    private Long id;
    private String eventName;
    private Timestamp date;
    private Long parliamentId;
    private String parliament;
    private Long stateId;
    private String state;
    private String leaderName;
    private String role;
    private List<FormStatusVO> formStatuses;
    private Long formId;
    private String formStatus;
    private String formName;
    private String status;
    private Long totalEvents;
    private Long completedEvents;
    private Long pendingEvents;
    private Long leaderRoleId;
    private Boolean consolidated;


    public Boolean getConsolidated() {
        return consolidated;
    }

    public void setConsolidated(Boolean consolidated) {
        this.consolidated = consolidated;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public Timestamp getDate() {
        return date;
    }

    public void setDate(Timestamp date) {
        this.date = date;
    }

    public Long getParliamentId() {
        return parliamentId;
    }

    public void setParliamentId(Long parliamentId) {
        this.parliamentId = parliamentId;
    }

    public String getParliament() {
        return parliament;
    }

    public void setParliament(String parliament) {
        this.parliament = parliament;
    }

    public Long getStateId() {
        return stateId;
    }

    public void setStateId(Long stateId) {
        this.stateId = stateId;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getLeaderName() {
        return leaderName;
    }

    public void setLeaderName(String leaderName) {
        this.leaderName = leaderName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public List<FormStatusVO> getFormStatuses() {
        return formStatuses;
    }

    public void setFormStatuses(List<FormStatusVO> formStatuses) {
        this.formStatuses = formStatuses;
    }

    public Long getFormId() {
        return formId;
    }

    public void setFormId(Long formId) {
        this.formId = formId;
    }

    public String getFormStatus() {
        return formStatus;
    }

    public void setFormStatus(String formStatus) {
        this.formStatus = formStatus;
    }

    public String getFormName() {
        return formName;
    }

    public void setFormName(String formName) {
        this.formName = formName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getTotalEvents() {
        return totalEvents;
    }

    public void setTotalEvents(Long totalEvents) {
        this.totalEvents = totalEvents;
    }

    public Long getCompletedEvents() {
        return completedEvents;
    }

    public void setCompletedEvents(Long completedEvents) {
        this.completedEvents = completedEvents;
    }

    public Long getPendingEvents() {
        return pendingEvents;
    }

    public void setPendingEvents(Long pendingEvents) {
        this.pendingEvents = pendingEvents;
    }
    public Long getLeaderRoleId() {
        return leaderRoleId;
    }

    public void setLeaderRoleId(Long leaderRoleId) {
        this.leaderRoleId = leaderRoleId;
    }
}
