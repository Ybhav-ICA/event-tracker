package com.info.modules.questions.dao;

import com.info.modules.exceptions.GlobalException;
import com.info.modules.questions.rowMappers.FormRMVO;
import com.info.modules.questions.rowMappers.QuestionsRMVO;
import com.info.modules.questions.vo.*;
import com.info.utils.SPUtils;
import com.microsoft.sqlserver.jdbc.SQLServerDataTable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class QuestionsDAO {
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private DataSource dataSource;

    public SampleDBVO getSample(Long requestId) throws GlobalException {

        Long startTime = System.currentTimeMillis();
        try {

            //Cursor Mappers

            Map<String, RowMapper<?>> cursorMappers = new HashMap<String, RowMapper<?>>();


            cursorMappers.put("#result-set-3", new RowMapper<QuestionsDBVO>() {
                @Override
                public QuestionsDBVO mapRow(ResultSet resultSet, int i) throws SQLException {
                    resultSet.setFetchSize(1000);
                    ResultSetMetaData rsmd = resultSet.getMetaData();
                    int columnCount = rsmd.getColumnCount();
                    QuestionsDBVO question = new QuestionsDBVO();
                    if (columnCount == 8) {
                        question.setQuestionId(resultSet.getLong("QuestionID"));
                        question.setQuestion(resultSet.getString("Question"));
                        question.setOptionTypeId(resultSet.getLong("OptionTypeID"));
                        question.setOption(resultSet.getString("OptionValue"));
                        question.setOptionId(resultSet.getLong("OptionId"));
                        question.setValidateOn(resultSet.getString("Validations"));
                        question.setChoosenOptionId(resultSet.getLong("ChosenOptionID"));
                        question.setChoosenOptionValue(resultSet.getString("ChosenOptionValue"));
                    }
                    return question;
                }
            });

            cursorMappers.put("#result-set-4", new RowMapper<RegionAccessValidationVO>() {
                @Override
                public RegionAccessValidationVO mapRow(ResultSet resultSet, int i) throws SQLException {
                    resultSet.setFetchSize(1000);
                    ResultSetMetaData rsmd = resultSet.getMetaData();
                    int columnCount = rsmd.getColumnCount();
                    RegionAccessValidationVO validationVO = new RegionAccessValidationVO();
                    if (columnCount == 2) {
                        validationVO.setStatus(resultSet.getInt("StatusID"));
                        validationVO.setMessage(resultSet.getString("StatusMSG"));
                    }
                    return validationVO;
                }
            });

            cursorMappers.put("#result-set-1", new RowMapper<EventFormStatusVO>() {
                @Override
                public EventFormStatusVO mapRow(ResultSet resultSet, int i) throws SQLException {
                    resultSet.setFetchSize(1000);
                    ResultSetMetaData rsmd = resultSet.getMetaData();
                    int columnCount = rsmd.getColumnCount();
                    EventFormStatusVO eventVO = new EventFormStatusVO();
                    if (columnCount == 11) {
                        eventVO.setEventId(resultSet.getLong("EventID"));
                        eventVO.setEventName(resultSet.getString("EventName"));
                        eventVO.setDate(resultSet.getTimestamp("EventDate"));
                        eventVO.setRole(resultSet.getString("LeaderRoleName"));
                        eventVO.setLeaderName(resultSet.getString("LeaderName"));
                        eventVO.setParliament(resultSet.getString("PCName"));
                        eventVO.setState(resultSet.getString("StateName"));
                        eventVO.setEventStatus(resultSet.getString("EventStatus"));
                    }
                    return eventVO;
                }
            });


            cursorMappers.put("#result-set-2", new RowMapper<QuestionTemplateVersionVO>() {
                @Override
                public QuestionTemplateVersionVO mapRow(ResultSet resultSet, int i) throws SQLException {
                    resultSet.setFetchSize(1000);
                    ResultSetMetaData rsmd = resultSet.getMetaData();
                    int columnCount = rsmd.getColumnCount();
                    QuestionTemplateVersionVO template = new QuestionTemplateVersionVO();
                    if (columnCount == 3) {
                        template.setTemplateId(resultSet.getLong("QuestionTemplateID"));
                        template.setTemplateName(resultSet.getString("TemplateName"));
                        template.setRequestVersion(resultSet.getString("RequestVersion"));
                    }
                    return template;
                }
            });

            Map<String, Integer> outputParams = SPUtils.getEmptyOutputParams();
            MapSqlParameterSource inputParams = SPUtils.spInputParameters()
                    .addValue("RequestID", requestId);

            Map<String, Object> resultSets = SPUtils.executeMultiple(dataSource, null, SPUtils.GET_Request_Details, inputParams,
                    outputParams, cursorMappers);

            SampleDBVO response = new SampleDBVO();
            List<RegionAccessValidationVO> validationVO = (List<RegionAccessValidationVO>) resultSets.get("#result-set-4");
            response.setValidation(validationVO.size() > 0 ? validationVO.get(0) : new RegionAccessValidationVO());
            if (validationVO.size() > 0 && (validationVO.get(0).getStatus() == 1 || validationVO.get(0).getStatus() == 0)) {
                List<EventFormStatusVO> event = (List<EventFormStatusVO>) resultSets.get("#result-set-1");
                List<QuestionTemplateVersionVO> template = (List<QuestionTemplateVersionVO>) resultSets.get("#result-set-2");
                List<QuestionsDBVO> questions = (List<QuestionsDBVO>) resultSets.get("#result-set-3");
                response.setEvent(event.size() > 0 ? event.get(0) : new EventFormStatusVO());
                response.setQuestionTemplate(template.size() > 0 ? template.get(0) : new QuestionTemplateVersionVO());
                response.setQuestions(questions);
            }
            log.debug("Time taken to execute " + SPUtils.GET_Request_Details + " is " + (System.currentTimeMillis() - startTime) + "milliseconds");
            return response;
        } catch (Exception e) {
            log.error("An error occurred while fetching questions.", e);
            throw new GlobalException("An error occurred while fetching questions. Please contact Support Team.");
        }

    }

    public List<AnswersVO> getSavedAnswers(Long userId, Long formId) throws GlobalException {
        List<AnswersVO> response = new ArrayList<>();
        Long startTime = System.currentTimeMillis();
        try {
            Map<String, Integer> outputParams = SPUtils.getEmptyOutputParams();
            MapSqlParameterSource inputParams = SPUtils.spInputParameters()
                    .addValue("UserId", userId)
                    .addValue("FormId", userId);

//            response = SPUtils.execute(dataSource, null, SPUtils.GET_SAVED_ANSWERS, inputParams,
//                    outputParams, null, (rs,i)->{
//                AnswersVO vo=new AnswersVO();
//                vo.setQuestionId(rs.getLong("QuestionId"));
//                vo.setOptionValue(rs.getString("OptionValue"));
//                vo.setOptionId(rs.getLong("OptionId"));
//                return vo;
//                    });

            AnswersVO vo = new AnswersVO(1l, -1L, "text question");
            response.add(vo);


            AnswersVO vo1 = new AnswersVO(8l, 13L, "No");
            response.add(vo1);


            log.debug("Time taken to execute " + SPUtils.GET_SAVED_ANSWERS + " is " + (System.currentTimeMillis() - startTime) + "milliseconds");
        } catch (Exception e) {
            log.error("An error occurred while fetching saved answers.", e);
            throw new GlobalException("An error occurred while fetching saved answers. Please contact Support Team.");
        }
        return response;

    }

    public RegionAccessValidationVO onSaveSample(Long requestId, String version, Long submitFlag, List<AnswersVO> answers) throws GlobalException {
        RegionAccessValidationVO validationVO = new RegionAccessValidationVO();
        Long startTime = System.currentTimeMillis();
        try {
            SQLServerDataTable answersTT = new SQLServerDataTable();
            answersTT.addColumnMetadata("QuestionID", Types.NUMERIC);
            answersTT.addColumnMetadata("OptionID", Types.NUMERIC);
            answersTT.addColumnMetadata("Option_Text", Types.NVARCHAR);

            for (AnswersVO answer : answers) {
                answersTT.addRow(answer.getQuestionId(), answer.getOptionId(), answer.getOptionValue());
            }

            Map<String, Integer> outputParams = SPUtils.getEmptyOutputParams();
            MapSqlParameterSource inputParams = SPUtils.spInputParameters()
                    .addValue("RequestID", requestId)
                    .addValue("Version", version)
                    .addValue("IsSubmitted", submitFlag)
                    .addValue("UserResponse", answersTT);
            List<RegionAccessValidationVO> validationVOs = SPUtils.execute(dataSource, null, SPUtils.SAVE_SAMPLE, inputParams, outputParams, null, (rs, i) -> {
                RegionAccessValidationVO vo = new RegionAccessValidationVO();
                vo.setMessage(rs.getString("StatusMSG"));
                vo.setStatus(rs.getInt("StatusID"));
                return vo;
            });

            log.debug("Time taken to execute " + SPUtils.SAVE_SAMPLE + " is " + (System.currentTimeMillis() - startTime) + "milliseconds");

            if (validationVOs.size() > 0) {
                validationVO = validationVOs.get(0);
            }


        } catch (Exception e) {
            log.error("An error occurred while saving the sample", e);
            throw new GlobalException("An error occurred while saving the sample");
        }
        return validationVO;
    }

    public EventFormStatusVO getEventFormStatus(Long userId, Long formId) throws GlobalException {
        EventFormStatusVO eventStatus = new EventFormStatusVO();
        Long startTime = System.currentTimeMillis();
        try {
//            Map<String, Integer> outputParams = SPUtils.getEmptyOutputParams();
//            MapSqlParameterSource inputParams = SPUtils.spInputParameters()
//                    .addValue("UserId", userId)
//                    .addValue("RequestId", formId);
//            List<EventFormStatusVO> vos = SPUtils.execute(dataSource, null, SPUtils.Event_And_FormStatus, inputParams, outputParams,null,(rs,i)->{
//                EventFormStatusVO vo=new EventFormStatusVO();
//                vo.setEventId(rs.getLong(""));
//                vo.setEventName(rs.getString(""));
//                vo.setDate(rs.getTimestamp(""));
//                vo.setRole(rs.getString(""));
//                vo.setLeaderName(rs.getString(""));
//                vo.setParliament(rs.getString(""));
//                vo.setState(rs.getString(""));
//                vo.setFormStatus(rs.getString(""));
//                vo.setFormName(rs.getString(""));
//                vo.setEventStatus(rs.getString(""));
//                return vo;
//            });
//            log.debug("Time taken to execute " + SPUtils.Event_And_FormStatus + " is " + (System.currentTimeMillis() - startTime) + "milliseconds");
//            if(vos.size()>0){
//                eventStatus=vos.get(0);
//            }

            EventFormStatusVO vo = new EventFormStatusVO();
            vo.setEventId(1L);
            vo.setEventName("Rally");
            vo.setDate(new Timestamp(System.currentTimeMillis()));
            vo.setRole("Prime Minister");
            vo.setLeaderName("Modi");
            vo.setParliament("Guntur");
            vo.setState("Andhra Pradesh");
            vo.setFormStatus("Pending");
            //   vo.setFormName("General Public");
            vo.setEventStatus("Open");
            return vo;

        } catch (Exception e) {
            log.error("An error occurred while fetching event and form status", e);
            throw new GlobalException("An error occurred while fetching event and form status");
        }
    }

    public Map<String, Object> getSubmittedForms(Long userId, Long eventId) throws GlobalException {
        Map<String, Object> response = null;
        Long startTime = System.currentTimeMillis();
        try {
            //Cursor Mappers
            Map<String, RowMapper<?>> cursorMappers = new HashMap<String, RowMapper<?>>();

            cursorMappers.put("#result-set-2", (resultSet, i) -> {
                resultSet.setFetchSize(1000);
                ResultSetMetaData rsmd = resultSet.getMetaData();
                QuestionsDBVO question = new QuestionsDBVO();
                if (rsmd.getColumnCount() == 8) {
                    question.setQuestionId(resultSet.getLong("QuestionID"));
                    question.setQuestion(resultSet.getString("Question"));
                    question.setOptionTypeId(resultSet.getLong("OptionTypeID"));
                    question.setValidateOn(resultSet.getString("Validations"));
                    question.setOptionId(resultSet.getLong("OptionId"));
                    question.setOption(resultSet.getString("OptionValue"));
                    question.setChoosenOptionId(resultSet.getLong("ChosenOptionID"));
                    question.setChoosenOptionValue(resultSet.getString("ChosenOptionValue"));
                }
                return question;
            });

            cursorMappers.put("#result-set-1", new FormRMVO());

            Map<String, Integer> outputParams = SPUtils.getEmptyOutputParams();
            MapSqlParameterSource inputParams = SPUtils.spInputParameters()
                    .addValue("UserID", userId)
                    .addValue("EventID", eventId);

            response = SPUtils.executeMultiple(dataSource, null, SPUtils.GET_SUBMITTED_FORMS, inputParams,
                    outputParams, cursorMappers);

            log.debug("Time taken to execute " + SPUtils.GET_SUBMITTED_FORMS + " is " + (System.currentTimeMillis() - startTime) + "milliseconds");
        } catch (Exception e) {
            log.error("An error occurred while fetching forms.", e);
            throw new GlobalException("An error occurred while fetching forms. Please contact Support Team.");
        }
        return response;
    }

    public Boolean saveReport(Long eventId, Long userId, List<AnswersVO> uivo) throws GlobalException {
        Long startTime = System.currentTimeMillis();
        try {
            SQLServerDataTable answersTT = new SQLServerDataTable();
            answersTT.addColumnMetadata("QuestionID", Types.NUMERIC);
            answersTT.addColumnMetadata("OptionID", Types.NUMERIC);
            answersTT.addColumnMetadata("Option_Text", Types.NVARCHAR);

            for (AnswersVO answer : uivo) {
                answersTT.addRow(answer.getQuestionId(), answer.getOptionId(), answer.getOptionValue());
            }

            Map<String, Integer> outputParams = SPUtils.getEmptyOutputParams();
            MapSqlParameterSource inputParams = SPUtils.spInputParameters()
                    .addValue("EventID", eventId)
                    .addValue("UserID", userId)
                    .addValue("AnalystResponse", answersTT);

            SPUtils.execute(dataSource, null, SPUtils.SAVE_REPORT, inputParams, outputParams);

            log.debug("Time taken to execute " + SPUtils.SAVE_REPORT + " is " + (System.currentTimeMillis() - startTime) + "milliseconds");

        } catch (Exception e) {
            log.error("An error occurred while saving report.", e);
            throw new GlobalException("An error occurred while saving report. Please contact support team.");
        }
        return true;
    }
}
