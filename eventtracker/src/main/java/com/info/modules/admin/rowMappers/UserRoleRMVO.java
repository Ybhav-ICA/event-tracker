package com.info.modules.admin.rowMappers;

import com.info.modules.admin.vo.UserRoleVO;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class UserRoleRMVO implements RowMapper<UserRoleVO> {
    @Override
    public UserRoleVO mapRow(ResultSet rs, int rowNum) throws SQLException {
        UserRoleVO vo=new UserRoleVO();
        vo.setId(rs.getLong("RoleId"));
        vo.setName(rs.getString("RoleName"));
        return vo;
    }
}
