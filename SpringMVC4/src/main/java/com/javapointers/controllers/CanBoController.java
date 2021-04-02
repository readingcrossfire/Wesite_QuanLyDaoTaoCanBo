package com.javapointers.controllers;

import com.javapointers.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Controller
public class CanBoController {
    @Autowired
    ICanBo canBo;

    @RequestMapping(value="/can-bo", method = RequestMethod.GET)
    public String CanBo(){
        List<Map<String, Object>> objListResult=canBo.LayDanhSachCanBo();
        return "canbo";
    }

    @RequestMapping(value="/them-can-bo", method = RequestMethod.GET)
    public String ThemCanBo(){
        return "themcanbo";
    }

    @RequestMapping(value="/them-can-bo", method = RequestMethod.POST)
    public String ThemLopHocVien(@RequestParam("tenCanBo") String tenCanBo, @RequestParam("chucVu") String chucVu, @RequestParam("phongBan") String phongBan){
        String macanBo= UUID.randomUUID().toString();
        if(canBo.ThemCanBo(new ThemCanBoObject(macanBo, tenCanBo, chucVu, phongBan))>1){
            return "SUCCESS";
        }
        else{
            return "FAIL";
        }
    }

    @RequestMapping(value="/cap-nhat-can-bo", method = RequestMethod.GET)
    public String CapNhatHocVien(){
        return "capnhatcanbo";
    }

    @RequestMapping(value="/cap-nhat-can-bo", method = RequestMethod.PUT)
    public String CapNhatLopHocVien(@RequestParam("maCanBo") String maCanBo,@RequestParam("tenCanBo") String tenCanBo, @RequestParam("chucVu") String chucVu, @RequestParam("phongBan") String phongBan){
        if(canBo.CapNhatCanBo(new CapNhatCanBoObject(maCanBo, tenCanBo, chucVu, phongBan))>1){
            return "SUCCESS";
        }
        else{
            return "FAIL";
        }
    }

    @RequestMapping(value="/xoa-can-bo", method = RequestMethod.PUT)
    public String XoaLopHocVien(@RequestParam("maCanBo") String maCanBo){
        if(canBo.XoaCanBo(maCanBo)>1){

            return "SUCCESS";
        }
        else{
            return "FAIL";
        }
    }

    @RequestMapping(value="/danh-sach-can-bo", method = RequestMethod.GET)
    @ResponseBody
    public List<Map<String, Object>> DanhSachCanBo(HttpSession session, HttpServletResponse response, HttpServletRequest request) throws InterruptedException {
        List<Map<String, Object>> objListResult = canBo.LayDanhSachCanBo();
        return objListResult;
    }
}
