package com.info.modules.login.controller;

import com.info.modules.exceptions.GlobalException;
import com.info.modules.login.service.LoginService;
import com.info.modules.login.vo.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@RestController
public class LoginController {
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private LoginService loginService;


    @RequestMapping(path = "mvc/login", method = RequestMethod.POST)
    public
    @ResponseBody
    LoginUserVO login(HttpServletRequest request, HttpServletResponse response, @RequestBody LoginUserVO uivo) throws GlobalException {
        String userName = uivo.getUserName();
        String password = uivo.getPassword();
        HttpSession sess = request.getSession(true);
        LoginStatusVO user = loginService.login(userName, password);
        if (user.getStatus()) {
            return user.getUser();
        } else {
            sess.invalidate();
            throw new GlobalException(user.getMessage());
        }
    }

    @RequestMapping(value = "mvc/logout", method = RequestMethod.GET)
    public
    @ResponseBody
    boolean logout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession sess = request.getSession(false);
        if (sess != null) {
            sess.invalidate();
        }
        return true;
    }
}
