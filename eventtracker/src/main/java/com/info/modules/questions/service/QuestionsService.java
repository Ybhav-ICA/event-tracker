package com.info.modules.questions.service;

import com.info.modules.exceptions.GlobalException;
import com.info.modules.questions.dao.QuestionsDAO;
import com.info.modules.questions.vo.*;
import javassist.tools.rmi.Sample;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class QuestionsService {
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private QuestionsDAO questionsDAO;

    private SampleVO getSampleVO(List<QuestionsDBVO> dbvos) {
        SampleVO response = new SampleVO();

        Map<Long, QuestionsVO> questionsMap = new HashMap<>();

        //building questions and answers
        List<QuestionsVO> questions = new ArrayList<>();
        List<AnswersVO> answers = new ArrayList<>();

        for (QuestionsDBVO vo : dbvos) {
            if (questionsMap.get(vo.getQuestionId()) != null) {
                OptionsVO option = new OptionsVO(vo.getOption(), vo.getOptionId());
                questionsMap.get(vo.getQuestionId()).getOptions().add(option);
            } else {
                QuestionsVO question = new QuestionsVO();
                question.setQuestionId(vo.getQuestionId());
                question.setQuestion(vo.getQuestion());
                question.setOptionTypeId(vo.getOptionTypeId());
                question.setValidateOn(vo.getValidateOn());
                List<OptionsVO> options = new ArrayList<>();
                OptionsVO option = new OptionsVO(vo.getOption(), vo.getOptionId());
                options.add(option);
                question.setOptions(options);
                questionsMap.put(vo.getQuestionId(), question);
                questions.add(question);
                AnswersVO answer = new AnswersVO(vo.getQuestionId(), vo.getChoosenOptionId(), vo.getChoosenOptionValue());
                answers.add(answer);
            }
        }

        response.setQuestions(questions);
        response.setAnswers(answers);
        return response;
    }

    public SampleVO getSample(Long requestId) throws GlobalException {

        try {
            SampleVO response = new SampleVO();
            SampleDBVO sampleDBVO = questionsDAO.getSample(requestId);
            if (sampleDBVO.getValidation().getStatus() == 1 || sampleDBVO.getValidation().getStatus() == 0) {

                response = getSampleVO(sampleDBVO.getQuestions());

                //building event Object
                EventFormStatusVO event = sampleDBVO.getEvent();
                QuestionTemplateVersionVO questionTemplate = sampleDBVO.getQuestionTemplate();
                event.setTemplateName(questionTemplate.getTemplateName());
                event.setRequestVersion(questionTemplate.getRequestVersion());
                event.setTemplateId(questionTemplate.getTemplateId());

                response.setEvent(event);
            } else {
                response.setQuestions(new ArrayList<>());
                response.setAnswers(new ArrayList<>());
                response.setEvent(new EventFormStatusVO());
            }
            response.setValidation(sampleDBVO.getValidation());
            return response;

        } catch (Exception e) {
            log.error("An error occurred while fetching questions");
            throw new GlobalException("An error occurred while fetching questions");
        }
    }

    public List<AnswersVO> getSavedAnswers(Long userId, Long formId) throws GlobalException {
        return questionsDAO.getSavedAnswers(userId, formId);
    }

    public RegionAccessValidationVO onSaveSample(Long requestId, String version, Long submitFlag, List<AnswersVO> vo) throws GlobalException {
        return questionsDAO.onSaveSample(requestId, version, submitFlag, vo);
    }

    public EventFormStatusVO getEventFormStatus(Long userId, Long formId) throws GlobalException {
        return questionsDAO.getEventFormStatus(userId, formId);
    }

    public AnalystResponseVO getSubmittedForms(Long userId, Long eventId) throws GlobalException {
        Map<String, Object> response = questionsDAO.getSubmittedForms(userId, eventId);

        List<FormDBVO> formDBVOS = (List<FormDBVO>) response.get("#result-set-1");
        List<QuestionsDBVO> questionsDBVOS = (List<QuestionsDBVO>) response.get("#result-set-2");

        SampleVO questions = getSampleVO(questionsDBVOS);

        AnalystResponseVO responseVO = new AnalystResponseVO();
        responseVO.setQuestions(questions);
        responseVO.setForms(formDBVOS);

        return responseVO;
    }

    public Boolean saveReport(Long eventId, Long userId, List<AnswersVO> uivo) throws GlobalException {
        return questionsDAO.saveReport(eventId, userId, uivo);
    }
}
