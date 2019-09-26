package com.info.modules.questions.rowMappers;

import com.info.modules.questions.vo.FormDBVO;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class FormRMVO implements RowMapper<FormDBVO> {
    @Override
    public FormDBVO mapRow(ResultSet resultSet, int i) throws SQLException {
        FormDBVO vo = new FormDBVO();
        vo.setTemplateId(resultSet.getLong("QuestionTemplate_ID"));
        vo.setTemplateName(resultSet.getString("TemplateName"));
        vo.setQuestionId(resultSet.getLong("QuestionID"));
        vo.setQuestion(resultSet.getString("Question"));
        vo.setOptionTypeId(resultSet.getLong("OptionTypeID"));
        vo.setValidateOn(resultSet.getString("Validations"));
        vo.setOptionId(resultSet.getLong("OptionId"));
        vo.setOption(resultSet.getString("OptionValue"));
        vo.setChoosenOptionId(resultSet.getLong("ChosenOptionID"));
        vo.setChoosenOptionValue(resultSet.getString("ChosenOptionValue"));
        return vo;
    }

}
