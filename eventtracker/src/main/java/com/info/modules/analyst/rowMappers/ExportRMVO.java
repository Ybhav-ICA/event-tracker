package com.info.modules.analyst.rowMappers;

import com.info.modules.analyst.vo.ExportVO;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ExportRMVO implements RowMapper<ExportVO> {
    @Override
    public ExportVO mapRow(ResultSet resultSet, int i) throws SQLException {
        ExportVO vo = new ExportVO();
        vo.setId(resultSet.getLong("ExportConfigID"));
        vo.setFileName(resultSet.getString("FileName"));
        vo.setFileData(resultSet.getBytes("FileData"));
        return vo;
    }
}
