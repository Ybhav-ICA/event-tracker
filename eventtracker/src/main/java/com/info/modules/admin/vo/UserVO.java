package com.info.modules.admin.vo;

public class UserVO {
    private long userId;
    private String userName;
    private long roleId;
    private String roleName;
    private String email;
    private String mobileNo;
    private long stateId;
    private String stateName;
    private String constituencyIds;
    private String ConstituenciesNames;

    private long constituencyId;
    private String constituencyName;


    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public long getRoleId() {
        return roleId;
    }

    public void setRoleId(long roleId) {
        this.roleId = roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobileNo() {
        return mobileNo;
    }

    public void setMobileNo(String mobileNo) {
        this.mobileNo = mobileNo;
    }

    public long getStateId() {
        return stateId;
    }

    public void setStateId(long stateId) {
        this.stateId = stateId;
    }

    public String getStateName() {
        return stateName;
    }

    public void setStateName(String stateName) {
        this.stateName = stateName;
    }

    public String getConstituencyIds() {
        return constituencyIds;
    }

    public void setConstituencyIds(String constituencyIds) {
        this.constituencyIds = constituencyIds;
    }

    public String getConstituenciesNames() {
        return ConstituenciesNames;
    }

    public void setConstituenciesNames(String constituenciesNames) {
        ConstituenciesNames = constituenciesNames;
    }

    public long getConstituencyId() {
        return constituencyId;
    }

    public void setConstituencyId(long constituencyId) {
        this.constituencyId = constituencyId;
    }

    public String getConstituencyName() {
        return constituencyName;
    }

    public void setConstituencyName(String constituencyName) {
        this.constituencyName = constituencyName;
    }
}
