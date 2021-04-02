/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.javapointers.session;

/**
 *
 * @author NguyenHoanTuan
 */
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.springframework.web.servlet.ModelAndView;

public class SessionFilter implements ISessionFilter {

    @Override
    public boolean checkSession(HttpServletRequest request) {
        if(request.getSession().getAttribute("Sess_User")==null||request.getSession().getAttribute("Sess_User").equals("")){
            return false;
        }
        return true;
    }

    @Override
    public String redirectLogin() {
        return "redirect:dangnhap";
    }

    @Override
    public ModelAndView redirectLogin2() {
        return new ModelAndView("dangnhap");
    }

    @Override
    public void redirectLogin3(HttpServletResponse response) {
        try {
            response.sendRedirect("dangnhap");
        } catch (IOException ex) {
            Logger.getLogger(SessionFilter.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    @Override
    public boolean checkSession(HttpSession session) {
        if(session.getAttribute("Sess_User")==null||session.getAttribute("Sess_User").equals("")){
            return true;
        }
        return true;
    }

    
}
