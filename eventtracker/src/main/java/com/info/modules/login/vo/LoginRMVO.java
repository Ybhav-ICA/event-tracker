package com.info.modules.login.vo;

public class LoginRMVO {
    private LoginStatusVO status;
    private LoginUserVO user;

    public LoginStatusVO getStatus() {
        return status;
    }

    public void setStatus(LoginStatusVO status) {
        this.status = status;
    }

    public LoginUserVO getUser() {
        return user;
    }

    public void setUser(LoginUserVO user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return "LoginRMVO{" +
                "status=" + status +
                ", user=" + user +
                '}';
    }
}
