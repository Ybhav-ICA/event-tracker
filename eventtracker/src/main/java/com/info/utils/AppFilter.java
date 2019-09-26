package com.info.utils;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.context.annotation.Configuration;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@Configuration
public class AppFilter implements Filter {

    private Logger log = LogManager.getLogger(this.getClass());

    @Override
    public void init(FilterConfig arg0) throws ServletException {
        // TODO Auto-generated method stub
    }

    @Override
    public void destroy() {
        // TODO Auto-generated method stub
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpReq = (HttpServletRequest) req;
        HttpServletResponse httpRes = (HttpServletResponse) res;
        HttpSession sess = httpReq.getSession(false);

        if (httpReq.getRequestURI().contains("/r/")) {
            httpRes.sendRedirect("/EventTracker");
            return;
            //chain.doFilter(req, res);
        }
        else {
            chain.doFilter(req, res);
        }
    }
}
