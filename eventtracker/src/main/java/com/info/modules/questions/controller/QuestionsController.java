package com.info.modules.questions.controller;

import com.info.modules.exceptions.GlobalException;
import com.info.modules.questions.service.QuestionsService;
import com.info.modules.questions.vo.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("mvc")
public class QuestionsController {
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private QuestionsService questionsService;

    @RequestMapping(path = "/getSample", method = RequestMethod.GET)
    public
    @ResponseBody
    SampleVO getQuestions(@RequestParam("requestId") Long requestId) throws GlobalException {
        try {
            return questionsService.getSample(requestId);

        } catch (Exception e) {
            log.error("An error occurred while fetching sample");
            throw new GlobalException("An error occurred while fetching sample");
        }
    }

    @RequestMapping(path = "/onSaveSample", method = RequestMethod.POST)
    public
    @ResponseBody
    RegionAccessValidationVO onSaveSample(@RequestParam("requestId") Long requestId, @RequestParam("version") String version,
                                          @RequestParam("submitFlag") Long submitFlag, @RequestBody List<AnswersVO> vo) throws GlobalException {
        return questionsService.onSaveSample(requestId, version, submitFlag, vo);
    }

    @RequestMapping(path = "/getEventFormStatus", method = RequestMethod.GET)
    public
    @ResponseBody
    EventFormStatusVO getEventFormStatus(@RequestParam("userId") Long userId, @RequestParam("formId") Long formId) throws GlobalException {
        return questionsService.getEventFormStatus(userId, formId);
    }

    @RequestMapping(path = "/submittedForms", method = RequestMethod.GET)
    public
    @ResponseBody
    AnalystResponseVO getSubmittedForms(@RequestParam("userId") Long userId, @RequestParam("eventId") Long eventId) throws GlobalException {
        return questionsService.getSubmittedForms(userId, eventId);
    }

    @RequestMapping(path = "/saveReport", method = RequestMethod.POST)
    public
    @ResponseBody
    Boolean saveReport(@RequestParam("eventId") Long eventId, @RequestParam("userId") Long userId,
                       @RequestBody List<AnswersVO> uivo) throws GlobalException {

        return questionsService.saveReport(eventId, userId, uivo);
    }
}
