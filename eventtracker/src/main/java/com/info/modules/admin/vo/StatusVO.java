package com.info.modules.admin.vo;

public class StatusVO {
    private int statusId;
    private String Comments;

    public int getStatusId() {
        return statusId;
    }

    public void setStatusId(int statusId) {
        this.statusId = statusId;
    }

    public String getComments() {
        return Comments;
    }

    @Override
    public String toString() {
        return "StatusVO{" +
                "statusId=" + statusId +
                ", Comments='" + Comments + '\'' +
                '}';
    }

    public void setComments(String comments) {
        Comments = comments;
    }

}