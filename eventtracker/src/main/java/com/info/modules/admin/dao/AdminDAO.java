package com.info.modules.admin.dao;

import com.info.modules.admin.rowMappers.*;
import com.info.modules.admin.vo.*;
import com.info.modules.exceptions.GlobalException;
import com.info.utils.SPUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@Component
public class AdminDAO {
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private DataSource dataSource;

    public List<UserRoleVO> getUserRoles(long loginUserId) throws GlobalException {
        List<UserRoleVO> roles = new ArrayList<>();
        Long startTime = System.currentTimeMillis();
        try {
            Map<String, Integer> outputParams = SPUtils.getEmptyOutputParams();
            MapSqlParameterSource inputParams = SPUtils.spInputParameters()
                    .addValue("UserId", loginUserId);
            roles = SPUtils.execute(dataSource, null, SPUtils.GET_UserRoles, inputParams,
                    outputParams, null, new UserRoleRMVO());
            log.debug("Time taken to execute " + SPUtils.GET_UserRoles + " is " + (System.currentTimeMillis() - startTime) + "milliseconds");

        } catch (Exception e) {
            log.error("An error occurred while fetching Event User Roles .", e);
            throw new GlobalException("An error occurred while fetching Event User Roles. Please contact Support Team.");
        }

        return roles;
    }

    public List<StateVO> getStates(long loginUserId) throws GlobalException {
        List<StateVO> states = new ArrayList<>();
        Long startTime = System.currentTimeMillis();
        try {
            Map<String, Integer> outputParams = SPUtils.getEmptyOutputParams();
            MapSqlParameterSource inputParams = SPUtils.spInputParameters()
                    .addValue("UserId", loginUserId);
            states = SPUtils.execute(dataSource, null, SPUtils.GET_States, inputParams,
                    outputParams, null, new StateRMVO());
            log.debug("Time taken to execute " + SPUtils.GET_States + " is " + (System.currentTimeMillis() - startTime) + "milliseconds");

        } catch (Exception e) {
            log.error("An error occurred while fetching States .", e);
            throw new GlobalException("An error occurred while fetching States. Please contact Support Team.");
        }

        return states;
    }

    public List<ConstituencyVO> getParliaments(Long loginUserId, long stateId) throws GlobalException {
        List<ConstituencyVO> parliments = new ArrayList<>();
        Long startTime = System.currentTimeMillis();
        try {
            Map<String, Integer> outputParams = SPUtils.getEmptyOutputParams();
            MapSqlParameterSource inputParams = SPUtils.spInputParameters()
                    .addValue("UserId", loginUserId)
                    .addValue("StateId", stateId);
            parliments = SPUtils.execute(dataSource, null, SPUtils.GET_Parliaments, inputParams,
                    outputParams, null, new ConstituencyRMVO());
            log.debug("Time taken to execute " + SPUtils.GET_Parliaments + " is " + (System.currentTimeMillis() - startTime) + "milliseconds");

        } catch (Exception e) {
            log.error("An error occurred while fetching Parliments .", e);
            throw new GlobalException("An error occurred while fetching Parliments. Please contact Support Team.");
        }
        return parliments;
    }

    public StatusVO saveEventUser(long loginUserId, UserVO uivo) throws GlobalException {
        StatusVO statusVO = null;
        Long startTime = System.currentTimeMillis();
        try {
            Map<String, Integer> outputParams = SPUtils.getEmptyOutputParams();
            MapSqlParameterSource inputParams = new MapSqlParameterSource();
            inputParams.addValue("UserId", loginUserId);
            inputParams.addValue("EventUser_Id", uivo.getUserId());
            inputParams.addValue("EventUserName", uivo.getUserName());
            inputParams.addValue("Role_Id", uivo.getRoleId());
            inputParams.addValue("EmailId", uivo.getEmail());
            inputParams.addValue("PhoneNumber", uivo.getMobileNo());
            inputParams.addValue("StateId", uivo.getStateId());
            inputParams.addValue("PCNo", uivo.getConstituencyIds());
            List<StatusVO> list = SPUtils.execute(dataSource, null, SPUtils.SP_CreateEventUser, inputParams, outputParams,
                    null, new StatusMapperRMVO());
            statusVO = list.get(0);
            log.debug("Time taken to execute " + SPUtils.SP_CreateEventUser + " is " + (System.currentTimeMillis() - startTime) + "milliseconds");

        } catch (Exception e) {
            log.error("An error occurred while saving New User .", e);
            throw new GlobalException("An error occurred while saving New User. Please contact Support Team.");
        }
        return statusVO;
    }


    public List<UserVO> getEventUsers(long loginUserId) throws GlobalException {
        List<UserVO> userVO = new ArrayList<>();
        Long startTime = System.currentTimeMillis();

        try {
            Map<String, Integer> outputParams = SPUtils.getEmptyOutputParams();
            MapSqlParameterSource inputParams = new MapSqlParameterSource();
            inputParams.addValue("UserId", loginUserId);
            userVO = SPUtils.execute(dataSource, null, SPUtils.SP_GetEventUsers, inputParams,
                    outputParams, null, new EventUserRMVO());

            log.debug("Time taken to execute " + SPUtils.SP_GetEventUsers + " is " + (System.currentTimeMillis() - startTime) + "milliseconds");


        } catch (Exception e) {
            log.error("An error occurred while fetching Event Users.", e);
            throw new GlobalException("An error occurred while fetching Event Users.. Please contact Support Team.");
        }
        return userVO;
    }

    public Boolean deleteEventUser(long loginUserId, String eventUserIds) throws GlobalException {
        Long startTime = System.currentTimeMillis();

        try {
            Map<String, Integer> outputParams = SPUtils.getEmptyOutputParams();
            MapSqlParameterSource inputParams = new MapSqlParameterSource();
            inputParams.addValue("UserId", loginUserId);
            inputParams.addValue("EventUserId", eventUserIds);
            SPUtils.execute(dataSource, null, SPUtils.SP_DELETEUSER, inputParams,
                    outputParams);

            log.debug("Time taken to execute " + SPUtils.SP_DELETEUSER + " is " + (System.currentTimeMillis() - startTime) + "milliseconds");


        } catch (Exception e) {
            log.error("An error occurred while deleting Event Users.", e);
            throw new GlobalException("An error occurred while deleting Event Users.. Please contact Support Team.");
        }
        return true;
    }

    public Boolean deleteAssignedConstituency(long loginUserId, long eventUserId, long stateId, long constyId) throws GlobalException {
        Long startTime = System.currentTimeMillis();

        try {
            Map<String, Integer> outputParams = SPUtils.getEmptyOutputParams();
            MapSqlParameterSource inputParams = new MapSqlParameterSource();
            inputParams.addValue("UserId", loginUserId);
            inputParams.addValue("EventUser_Id", eventUserId);
            inputParams.addValue("State_Id", stateId);
            inputParams.addValue("PCNo", constyId);
            SPUtils.execute(dataSource, null, SPUtils.SP_DELETEASSIGNEDCONSTITUENCY, inputParams,
                    outputParams);

            log.debug("Time taken to execute " + SPUtils.SP_DELETEASSIGNEDCONSTITUENCY + " is " + (System.currentTimeMillis() - startTime) + "milliseconds");


        } catch (Exception e) {
            log.error("An error occurred while deleting Assigned parliment of User .", e);
            throw new GlobalException("An error occurred while deleting Assigned parliment of User. Please contact Support Team.");
        }
        return true;
    }

    public List<LeaderRolesVO> getLeaderRoles(Long loginUserId) throws GlobalException {
        List<LeaderRolesVO> response = new ArrayList<>();
        Long startTime = System.currentTimeMillis();

        try {
            Map<String, Integer> outputParams = SPUtils.getEmptyOutputParams();
            MapSqlParameterSource inputParams = new MapSqlParameterSource();
            inputParams.addValue("UserId", loginUserId);

            response = SPUtils.execute(dataSource, null, SPUtils.GET_LEADER_ROLES, inputParams,
                    outputParams, null, (rs, i) -> {
                        LeaderRolesVO vo = new LeaderRolesVO();
                        vo.setLeaderRoleId(rs.getLong("LeaderRole_Id"));
                        vo.setLeaderRoleName(rs.getString("LeaderRoleName"));
                        vo.setLeaderName(rs.getString("LeaderName"));
                        return vo;
                    });

            log.debug("Time taken to execute " + SPUtils.GET_LEADER_ROLES + " is " + (System.currentTimeMillis() - startTime) + "milliseconds");


        } catch (Exception e) {
            log.error("An error occurred while fetching  Leader Roles .", e);
            throw new GlobalException("An error occurred while fetching  Leader Roles . Please contact Support Team.");
        }
        return response;
    }

    public EventVO saveEvent(Long loginUserId, EventUIVO vo) throws GlobalException {
        Long startTime = System.currentTimeMillis();
        EventVO eventVO=new EventVO();
        try {
            Map<String, Integer> outputParams = SPUtils.getEmptyOutputParams();
            MapSqlParameterSource inputParams = new MapSqlParameterSource();
            inputParams.addValue("UserId", loginUserId);
            inputParams.addValue("EventId", vo.getEventId());
            inputParams.addValue("EventName", vo.getEventName());
            inputParams.addValue("LeaderRole_Id", vo.getLeaderRoleId());
            inputParams.addValue("LeaderName", vo.getLeaderName());
            inputParams.addValue("State_Id", vo.getStateId());
            inputParams.addValue("PCNo", vo.getParliamentId());
            inputParams.addValue("EventDate", vo.getDate());
            List<EventVO> evos=SPUtils.execute(dataSource, null, SPUtils.SAVE_EVENT, inputParams,
                    outputParams,null,(rs,i)->{
                EventVO evo=new EventVO();
                evo.setId(rs.getLong("EventId"));
                evo.setStateId(rs.getLong("StateId"));
                return  evo;
                    });
           if(evos.size()>0){
               eventVO=evos.get(0);

           }

            log.debug("Time taken to execute " + SPUtils.SAVE_EVENT + " is " + (System.currentTimeMillis() - startTime) + "milliseconds");


        } catch (Exception e) {
            log.error("An error occurred while saving event .", e);
            throw new GlobalException("An error occurred while saving event. Please contact Support Team.");
        }
        return eventVO;
    }

    public List<EventVO> getEvents(Long userId, Integer pageNumber, Integer pageSize) throws GlobalException {
        List<EventVO> events = new ArrayList<>();
        Long startTime = System.currentTimeMillis();
        try {
            Map<String, Integer> outputParams = SPUtils.getEmptyOutputParams();
            MapSqlParameterSource inputParams = new MapSqlParameterSource();
            inputParams.addValue("UserId", userId);
            inputParams.addValue("PageNumber", pageNumber);
            inputParams.addValue("PageSize", pageSize);

            events = SPUtils.execute(dataSource, null, SPUtils.GET_EVENTS, inputParams,
                    outputParams, null, new EventRMVO());

            log.debug("Time taken to execute " + SPUtils.GET_EVENTS + " is " + (System.currentTimeMillis() - startTime) + "milliseconds");

        } catch (Exception e) {
            log.error("An error occurred while fetching Events.", e);
            throw new GlobalException("An error occurred while fetching Events. Please contact Support Team.");
        }
        return events;
    }

    public List<MailsDBVO> getMailIds(Long userId, Long eventId, Long stateId, Long resend) throws GlobalException {
        List<MailsDBVO> mails = new ArrayList<>();
        Long startTime = System.currentTimeMillis();
        try {
            Map<String, Integer> outputParams = SPUtils.getEmptyOutputParams();
            MapSqlParameterSource inputParams = new MapSqlParameterSource();
            inputParams.addValue("UserId", userId);
            inputParams.addValue("EventID", eventId);
            inputParams.addValue("StateId", stateId);
            inputParams.addValue("Resend", resend);


            mails = SPUtils.execute(dataSource, null, SPUtils.GET_MAIL_IDS, inputParams,
                    outputParams, null, (rs,i)->{
                   MailsDBVO vo=new MailsDBVO();
                   vo.setEmailId(rs.getString("EmailId"));
                   vo.setUserName(rs.getString("UserName"));
                   vo.setRequestId(rs.getLong("RequestID"));
                   vo.setUserId(rs.getLong("EventUser_Id"));
                   vo.setTemplateName(rs.getString("TemplateName"));
                   return vo;
                    });

            log.debug("Time taken to execute " + SPUtils.GET_MAIL_IDS + " is " + (System.currentTimeMillis() - startTime) + "milliseconds");

        } catch (Exception e) {
            log.error("An error occurred while fetching MailIds.", e);
            throw new GlobalException("An error occurred while fetching MailIds. Please contact Support Team.");
        }
        return mails;
    }

    public Boolean deleteEvent(long loginUserId, String eventId) throws GlobalException {
        Long startTime = System.currentTimeMillis();

        try {
            Map<String, Integer> outputParams = SPUtils.getEmptyOutputParams();
            MapSqlParameterSource inputParams = new MapSqlParameterSource();
            inputParams.addValue("UserId", loginUserId);
            inputParams.addValue("EventId", eventId);
            SPUtils.execute(dataSource, null, SPUtils.SP_DELETEEVENT, inputParams,
                    outputParams);

            log.debug("Time taken to execute " + SPUtils.SP_DELETEEVENT + " is " + (System.currentTimeMillis() - startTime) + "milliseconds");


        } catch (Exception e) {
            log.error("An error occurred while deleting Event.", e);
            throw new GlobalException("An error occurred while deleting Event. Please contact Support Team.");
        }
        return true;
    }
}
