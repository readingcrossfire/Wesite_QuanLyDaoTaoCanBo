/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.javapointers.session;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.springframework.web.servlet.ModelAndView;

/**
 *
 * @author NguyenHoanTuan
 */
public interface ISessionFilter {
    public boolean checkSession(HttpServletRequest request);
    public boolean checkSession(HttpSession session);
    public String redirectLogin();
    public ModelAndView redirectLogin2();
    public void redirectLogin3(HttpServletResponse response);
}
