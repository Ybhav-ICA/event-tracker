package com.info.modules.admin.rowMappers;


import com.info.modules.admin.vo.StatusVO;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class StatusMapperRMVO implements RowMapper<StatusVO> {
    @Override
    public StatusVO mapRow(ResultSet rs, int rowNum) throws SQLException {
        StatusVO vo = new StatusVO();
        vo.setStatusId(rs.getInt("Status"));
        vo.setComments(rs.getString("Comments"));
        return vo;
    }
}