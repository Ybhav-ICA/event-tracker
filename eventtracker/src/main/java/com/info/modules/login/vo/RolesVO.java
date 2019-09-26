package com.info.modules.login.vo;

public class RolesVO {

    private long id;
    private String name;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "RolesVO{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }

    public RolesVO() {
    }

    public RolesVO(long id, String name) {

        this.id = id;
        this.name = name;
    }
}