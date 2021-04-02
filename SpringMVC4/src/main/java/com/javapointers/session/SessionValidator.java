/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.javapointers.session;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.javapointers.controllers.NguoiDungController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import java.io.*;
import java.net.URLDecoder;
import java.util.Map;

/**
 * @author Administrator
 */
public class SessionValidator extends HandlerInterceptorAdapter {

    @Autowired
    private com.javapointers.session.SessionFilter SessionFilter;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession();
        if (handler instanceof HandlerMethod) {

            String method = ((HandlerMethod) handler).getMethod().getName();
            String clazz = ((HandlerMethod) handler).getBeanType().getTypeName();
            Object handlerMethod =  ((HandlerMethod)handler).getBean();
            logAccess(method,clazz,request,session);
            if ( !(handlerMethod instanceof NguoiDungController)) {
                if (!SessionFilter.checkSession(session)) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.sendRedirect("dangnhap");

                    return false;
                }
            }
        }
        return true;
    }

    private void logAccess(String method, String clazz, HttpServletRequest request, HttpSession session) {

        String params = "";
        String dvtt = session.getAttribute("Sess_DVTT") + "";
        String userid = session.getAttribute("Sess_UserID") + "";
        String username = session.getAttribute("Sess_User") + "";
        String restMethod = request.getMethod();
        String agent = request.getHeader("user-agent");
        String serverIP = request.getLocalName();
        String url = request.getRequestURL().toString();
        //lichsusudung.createLogAccess(dvtt, clazz, method, url, userid, username, restMethod, params, agent, serverIP);


    }

    private String getParams(HttpServletRequest request) {
        StringBuffer buffer = new StringBuffer();
        Map<String, String[]> parameters = request.getParameterMap();
        for (String key : parameters.keySet()) {
            String[] value = parameters.get(key);
            if (value != null && value.length > 0) {
                buffer.append(key + ": " + toString(value) + ";");
            }
        }
        return buffer.toString();
    }

    public static String toString(Object[] a) {
        if (a == null)
            return "null";

        int iMax = a.length - 1;
        if (iMax == -1)
            return "[]";

        StringBuilder b = new StringBuilder();
        b.append('[');
        for (int i = 0; ; i++) {
            try {
                b.append(URLDecoder.decode(String.valueOf(a[i]), "UTF-8"));
            } catch (UnsupportedEncodingException e) {
            }
            if (i == iMax)
                return b.append(']').toString();
            b.append(", ");
        }
    }


}
