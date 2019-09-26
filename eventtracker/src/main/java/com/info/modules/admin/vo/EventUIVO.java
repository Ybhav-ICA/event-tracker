package com.info.modules.admin.vo;

import java.sql.Timestamp;

public class EventUIVO {
    private Long eventId;
    private String eventName;
    private Long leaderRoleId;
    private String leaderName;
    private Long stateId;
    private Long parliamentId;
    private Timestamp date;


    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public Long getLeaderRoleId() {
        return leaderRoleId;
    }

    public void setLeaderRoleId(Long leaderRoleId) {
        this.leaderRoleId = leaderRoleId;
    }

    public String getLeaderName() {
        return leaderName;
    }

    public void setLeaderName(String leaderName) {
        this.leaderName = leaderName;
    }

    public Long getStateId() {
        return stateId;
    }

    public void setStateId(Long stateId) {
        this.stateId = stateId;
    }

    public Long getParliamentId() {
        return parliamentId;
    }

    public void setParliamentId(Long parliamentId) {
        this.parliamentId = parliamentId;
    }

    public Timestamp getDate() {
        return date;
    }

    public void setDate(Timestamp date) {
        this.date = date;
    }
}
