package com.info.modules.analyst.rowMappers;

import com.info.modules.analyst.vo.AnalystReportVO;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class AnalystReportRMVO implements RowMapper<AnalystReportVO> {
    @Override
    public AnalystReportVO mapRow(ResultSet resultSet, int i) throws SQLException {
        AnalystReportVO vo = new AnalystReportVO();
        vo.setQuestionId(resultSet.getLong("QuestionId"));
        vo.setQuestion(resultSet.getString("Question"));
        vo.setOption(resultSet.getString("Option_Text"));
        return vo;
    }
}
