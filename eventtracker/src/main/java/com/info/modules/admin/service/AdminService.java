package com.info.modules.admin.service;


import com.info.modules.admin.dao.AdminDAO;
import com.info.modules.admin.vo.*;
import com.info.modules.exceptions.GlobalException;
import com.info.modules.questions.vo.MailRequestVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.util.*;

@Component
public class AdminService {


    @Value("${email.url}")
    private String URL_ADDRESS_PREFIX;


    private final Logger log = LoggerFactory.getLogger(this.getClass());
    @Autowired
    private AdminDAO adminDAO;

    public List<UserRoleVO> getUserRoles(long loginUserId) throws GlobalException {
        return adminDAO.getUserRoles(loginUserId);

    }

    public List<StateVO> getStates(long loginUserId) throws GlobalException {
        return adminDAO.getStates(loginUserId);
    }

    public List<ConstituencyVO> getParliaments(long loginUserId, long stateId) throws GlobalException {
        return adminDAO.getParliaments(loginUserId, stateId);
    }

    public StatusVO saveEventUser(long loginUserId, UserVO uivo) throws GlobalException {
        return adminDAO.saveEventUser(loginUserId, uivo);
    }

    public List<UserVO> getEventUsers(long loginUserId) throws GlobalException {
        return adminDAO.getEventUsers(loginUserId);
    }

    public Boolean deleteEventUser(long loginUserId, String eventUserIds) throws GlobalException {
        return adminDAO.deleteEventUser(loginUserId, eventUserIds);
    }

    public Boolean deleteAssignedConstituency(long loginUserId, long eventUserId, long stateId, long constyId) throws GlobalException {
        return adminDAO.deleteAssignedConstituency(loginUserId, eventUserId, stateId, constyId);
    }

    public List<LeaderRolesVO> getLeaderRoles(Long loginUserId) throws GlobalException {
        return adminDAO.getLeaderRoles(loginUserId);
    }

    public EventVO saveEvent(Long loginUserId, EventUIVO vo) throws GlobalException {
        return adminDAO.saveEvent(loginUserId, vo);
    }


    public Boolean sendEmail(Long userId, Long eventId, Long stateId, Long resend) throws MessagingException, GlobalException, UnsupportedEncodingException {
        try {
            List<MailsDBVO> mailsDBVO = adminDAO.getMailIds(userId, eventId, stateId, resend);
            if (mailsDBVO.size() > 0) {
                Map<Long, MailRequestVO> userAndRequestsMap = new HashMap<>();
                for (MailsDBVO mailDB : mailsDBVO) {
                    if (userAndRequestsMap.get(mailDB.getUserId()) != null) {
                        userAndRequestsMap.get(mailDB.getUserId()).setRequestId2(mailDB.getRequestId());
                        userAndRequestsMap.get(mailDB.getUserId()).setTemplateName2(mailDB.getTemplateName());
                    } else {
                        MailRequestVO vo = new MailRequestVO();
                        vo.setEmailId(mailDB.getEmailId());
                        vo.setUserId(mailDB.getUserId());
                        vo.setRequestId1(mailDB.getRequestId());
                        vo.setUserName(mailDB.getUserName());
                        vo.setTemplateName1(mailDB.getTemplateName());
                        userAndRequestsMap.put(mailDB.getUserId(), vo);
                    }
                }

                final String username = "database.reports@infocrunch.in";
                final String password = "Info(runch";

                Properties props = new Properties();
                props.put("mail.smtp.auth", "true");
                props.put("mail.smtp.starttls.enable", "true");
                props.put("mail.smtp.host", "smtp.gmail.com");
                props.put("mail.smtp.port", "587");

                Session session = Session.getInstance(props,
                        new javax.mail.Authenticator() {
                            protected PasswordAuthentication getPasswordAuthentication() {
                                return new PasswordAuthentication(username, password);
                            }
                        });
                Properties sessionProperties = session.getProperties();
                sessionProperties.put("mail.from", username);
                sessionProperties.put("mail.from.alias", "Event Tracker");

                Message message = new MimeMessage(session);

                message.setFrom(new InternetAddress("Event Tracker <database.reports@infocrunch.in>"));
                Set<Long> userMailIds = userAndRequestsMap.keySet();
                for (Long userMailId : userMailIds) {
                    MailRequestVO mailId = userAndRequestsMap.get(userMailId);
                    String request1 = "";
                    String request2 = "";
                    if (mailId.getRequestId1() != null) {
                        request1 = "\n " + mailId.getTemplateName1() + " : " + URL_ADDRESS_PREFIX + "userId=" + mailId.getUserId() + "&" + "requestId=" + mailId.getRequestId1();
                    }

                    if (mailId.getRequestId2() != null) {
                        request2 = "\n " + mailId.getTemplateName2() + " : " + URL_ADDRESS_PREFIX + "userId=" + mailId.getUserId() + "&" + "requestId=" + mailId.getRequestId2();
                    }

                    message.setRecipients(Message.RecipientType.TO,
                            InternetAddress.parse(mailId.getEmailId()));
                    message.setSubject("Election Campaign Event Feedback");
                    message.setText("Dear  " + mailId.getUserName() + " ,"
                            + "\n\nPlease visit the following links to fill the event feedback:"
                            + "\n"
                            + request1
                            + request2
                            + "\n\n Team Infocrunch");

                    Transport.send(message);
                }
            } else {
                return false;
            }
        } catch (MessagingException e) {
            log.error("An error occured while sending mails.Please contact support team");
            throw new RuntimeException(e);
        }
        return true;
    }

    public List<EventVO> getEvents(Long userId, Integer pageNumber, Integer pageSize) throws GlobalException {
        List<EventVO> eventVOS = adminDAO.getEvents(userId, pageNumber, pageSize);
        List<EventVO> events = new ArrayList<>();
        Map<Long, EventVO> eventMap = new HashMap<>();

        for (EventVO evo : eventVOS) {
            FormStatusVO status = new FormStatusVO();
            status.setId(evo.getFormId());
            status.setFormName(evo.getFormName());
            status.setFormStatus(evo.getFormStatus());

            if (eventMap.get(evo.getId()) == null) {
                List<FormStatusVO> formStatus = new ArrayList<>();
                formStatus.add(status);
                evo.setFormStatuses(formStatus);
                eventMap.put(evo.getId(), evo);
                events.add(evo);
            } else {
                eventMap.get(evo.getId()).getFormStatuses().add(status);
            }
        }
        return events;
    }

    public Boolean deleteEvent(long loginUserId, String eventId) throws GlobalException {
        return adminDAO.deleteEvent(loginUserId, eventId);
    }
}
