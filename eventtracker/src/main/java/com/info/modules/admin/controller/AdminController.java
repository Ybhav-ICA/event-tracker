package com.info.modules.admin.controller;

import com.info.modules.admin.service.AdminService;
import com.info.modules.admin.vo.*;
import com.info.modules.exceptions.GlobalException;
import com.info.modules.login.vo.RolesVO;
import com.info.modules.questions.service.QuestionsService;
import com.info.modules.questions.vo.QuestionsVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;
import java.util.List;

@RestController
@RequestMapping("mvc")
public class AdminController {
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private AdminService adminService;

    @RequestMapping(path = "/getUserRoles", method = RequestMethod.GET)
    public
    @ResponseBody
    List<UserRoleVO> getUserRoles(@RequestParam("loginUserId") Long loginUserId) throws GlobalException {
        return adminService.getUserRoles(loginUserId);
    }

    @RequestMapping(path = "/getStates", method = RequestMethod.GET)
    public
    @ResponseBody
    List<StateVO> getStates(@RequestParam("loginUserId") Long loginUserId) throws GlobalException {
        return adminService.getStates(loginUserId);
    }

    @RequestMapping(path = "/getParliaments", method = RequestMethod.GET)
    public
    @ResponseBody
    List<ConstituencyVO> getParliaments(@RequestParam("loginUserId") Long loginUserId, @RequestParam("stateId") Long stateId) throws GlobalException {
        return adminService.getParliaments(loginUserId, stateId);
    }

    @RequestMapping(path = "/saveEventUser", method = RequestMethod.POST)
    public
    @ResponseBody
    StatusVO saveEventUser(@RequestParam("loginUserId") Long loginUserId, @RequestBody UserVO uivo) throws GlobalException {
        return adminService.saveEventUser(loginUserId, uivo);
    }

    @RequestMapping(path = "/getEventUsers", method = RequestMethod.GET)
    public
    @ResponseBody
    List<UserVO> getEventUsers(@RequestParam("loginUserId") Long loginUserId) throws GlobalException {
        return adminService.getEventUsers(loginUserId);
    }

    @RequestMapping(path = "/deleteEventUser", method = RequestMethod.DELETE)
    public
    @ResponseBody
    Boolean deleteEventUser(@RequestParam("loginUserId") Long loginUserId, @RequestParam("eventUserIds") String eventUserIds) throws GlobalException {
        return adminService.deleteEventUser(loginUserId, eventUserIds);
    }

    @RequestMapping(path = "/deleteAssignedConstituency", method = RequestMethod.DELETE)
    public
    @ResponseBody
    Boolean deleteAssignedConstituency(@RequestParam("loginUserId") Long loginUserId,
                                       @RequestParam("eventUserId") long eventUserId,
                                       @RequestParam("stateId") long stateId,
                                       @RequestParam("constyId") long constyId) throws GlobalException {
        return adminService.deleteAssignedConstituency(loginUserId, eventUserId, stateId, constyId);
    }

    @RequestMapping(path = "/events", method = RequestMethod.GET)
    public
    @ResponseBody
    List<EventVO> getEvents(@RequestParam("userId") Long userId,
                            @RequestParam("pageNumber") Integer pageNumber,
                            @RequestParam("pageSize") Integer pageSize) throws GlobalException {

        return adminService.getEvents(userId, pageNumber, pageSize);
    }

    @RequestMapping(path = "/getLeaderRoles", method = RequestMethod.GET)
    public
    @ResponseBody
    List<LeaderRolesVO> getLeaderRoles(@RequestParam("loginUserId") Long loginUserId) throws GlobalException {
        return adminService.getLeaderRoles(loginUserId);
    }

    @RequestMapping(path = "/saveEvent", method = RequestMethod.POST)
    public
    @ResponseBody
    EventVO saveEvent(@RequestParam("loginUserId") Long loginUserId,@RequestBody EventUIVO vo) throws GlobalException {
        return adminService.saveEvent(loginUserId,vo);
    }


	@RequestMapping(path = "/sendEmail", method = RequestMethod.GET)
	public
	@ResponseBody
	Boolean sendEmail(@RequestParam("userId") Long  userId,@RequestParam("eventId") Long eventId,
                      @RequestParam("stateId") Long  stateId,@RequestParam("resend") Long resend) throws GlobalException, MessagingException, UnsupportedEncodingException {
		return adminService.sendEmail(userId,eventId,stateId,resend);
	}

    @RequestMapping(path = "/deleteEvent", method = RequestMethod.DELETE)
    public
    @ResponseBody
    Boolean deleteEvent(@RequestParam("loginUserId") Long loginUserId, @RequestParam("eventId") String eventId) throws GlobalException {
        return adminService.deleteEvent(loginUserId, eventId);
    }



}
