package com.info.modules.admin.rowMappers;

import com.info.modules.admin.vo.StateVO;
import com.info.modules.admin.vo.UserRoleVO;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class StateRMVO implements RowMapper<StateVO> {
    @Override
    public StateVO mapRow(ResultSet rs, int rowNum) throws SQLException {
        StateVO vo =new StateVO();
        vo.setId(rs.getLong("StateId"));
        vo.setName(rs.getString("StateName"));

        return vo;
    }
}
