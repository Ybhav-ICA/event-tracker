package com.info.modules.login.service;

import com.info.modules.exceptions.GlobalException;
import com.info.modules.login.dao.LoginDAO;
import com.info.modules.login.vo.LoginRMVO;
import com.info.modules.login.vo.LoginStatusVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class LoginService {

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private LoginDAO loginDAO;

    public LoginStatusVO login(String userName, String password) throws GlobalException {
        LoginStatusVO ls = new LoginStatusVO();
        LoginRMVO result = loginDAO.login(userName, password);
        ls.setMessage(result.getStatus().getMessage());
        ls.setStatus(result.getStatus().getStatus());
        if (result.getStatus().getStatus()) {
            ls.setUser(result.getUser());
        }
        return ls;
    }
}
