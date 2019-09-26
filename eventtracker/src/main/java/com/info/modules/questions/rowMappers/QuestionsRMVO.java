package com.info.modules.questions.rowMappers;

import com.info.modules.questions.vo.QuestionsDBVO;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class QuestionsRMVO implements RowMapper<QuestionsDBVO> {
    @Override
    public QuestionsDBVO mapRow(ResultSet resultSet, int i) throws SQLException {
        QuestionsDBVO vo=new QuestionsDBVO();
        vo.setQuestionId(resultSet.getLong("QuestionId"));
        vo.setQuestion(resultSet.getString("Question"));
        vo.setOptionTypeId(resultSet.getLong("OptionType_Id"));
        vo.setOption(resultSet.getString("OptionValue"));
        vo.setOptionId(resultSet.getLong("OptionId"));
        vo.setValidateOn(resultSet.getString("Validation"));
        return vo;
    }

}
