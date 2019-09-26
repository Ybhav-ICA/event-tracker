package com.info.modules.admin.rowMappers;

import com.info.modules.admin.vo.ConstituencyVO;

import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
public class ConstituencyRMVO implements RowMapper<ConstituencyVO> {
    @Override
    public ConstituencyVO mapRow(ResultSet rs, int rowNum) throws SQLException {
        ConstituencyVO vo=new ConstituencyVO();
        vo.setId(rs.getLong("PCNo"));
        vo.setName(rs.getString("PCName"));
        return vo;
    }


}
