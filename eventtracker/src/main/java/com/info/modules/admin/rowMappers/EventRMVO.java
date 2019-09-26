package com.info.modules.admin.rowMappers;

import com.info.modules.admin.vo.EventVO;
import com.info.modules.admin.vo.UserVO;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class EventRMVO implements RowMapper<EventVO> {
    @Override
    public EventVO mapRow(ResultSet rs, int rowNum) throws SQLException {
        EventVO vo = new EventVO();
        vo.setId(rs.getLong("EventId"));
        vo.setEventName(rs.getString("EventName"));
        vo.setDate(rs.getTimestamp("EventDate"));
        vo.setRole(rs.getString("LeaderRoleName"));
        vo.setLeaderName(rs.getString("LeaderName"));
        vo.setStateId(rs.getLong("State_Id"));
        vo.setState(rs.getString("StateName"));
        vo.setParliamentId(rs.getLong("PCNo"));
        vo.setParliament(rs.getString("PCName"));
        vo.setFormId(rs.getLong("QuestionTemplate_Id"));
        vo.setFormName(rs.getString("TemplateName"));
        vo.setFormStatus(rs.getString("StatusFlag"));
        vo.setStatus(rs.getString("EventStatus"));
        vo.setTotalEvents(rs.getLong("TotalCountofRecords"));
        vo.setCompletedEvents(rs.getLong("CompletedEvents"));
        vo.setPendingEvents(rs.getLong("PendingEvents"));
        vo.setLeaderRoleId(rs.getLong("LeaderRole_Id"));
        vo.setConsolidated(rs.getBoolean("Consolidated"));
        return vo;
    }
}
