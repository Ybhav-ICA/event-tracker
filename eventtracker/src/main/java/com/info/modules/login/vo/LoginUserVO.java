package com.info.modules.login.vo;


public class LoginUserVO {
    private Long id;
    private String name;
    private String userName;
    private String password;
    private Long roleId;
    private String roleName;
    private RolesVO role;
    private Long stateId;
    private Boolean active;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public RolesVO getRole() {
        return role;
    }

    public void setRole(RolesVO role) {
        this.role = role;
    }

    public Long getStateId() {
        return stateId;
    }

    public void setStateId(Long stateId) {
        this.stateId = stateId;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    @Override
    public String toString() {
        return "LoginUserVO{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", active=" + active +
                ", userName='" + userName + '\'' +
                ", roleId=" + roleId +
                ", roleName='" + roleName + '\'' +
                ", role=" + role +
                ", stateId=" + stateId +
                '}';
    }

    public LoginUserVO(Long id, String name, Boolean active, String userName, Long roleId, String roleName, Long stateId) {
        this.id = id;
        this.name = name;
        this.active = active;
        this.userName = userName;
        this.roleId = roleId;
        this.roleName = roleName;
        this.stateId = stateId;
        this.role = new RolesVO();
        this.role.setId(roleId);
        this.role.setName(roleName);
    }

    public LoginUserVO() {
    }
}

