package com.info.modules.admin.rowMappers;

import com.info.modules.admin.vo.UserVO;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class EventUserRMVO implements RowMapper<UserVO> {
    @Override
    public UserVO mapRow(ResultSet rs, int rowNum) throws SQLException {
        UserVO vo=new UserVO();
        vo.setUserId(rs.getLong("EventUserId"));
        vo.setUserName(rs.getString("UserName"));
        vo.setEmail(rs.getString("EmailId"));
        vo.setMobileNo(rs.getString("PhoneNumber"));
        vo.setRoleId(rs.getLong("Role_Id"));
        vo.setRoleName(rs.getString("RoleName"));
        vo.setStateId(rs.getLong("State_Id"));
        vo.setStateName(rs.getString("StateName"));
        vo.setConstituencyId(rs.getLong("PCNo"));
        vo.setConstituencyName(rs.getString("PCName"));
        return vo;
    }
}
