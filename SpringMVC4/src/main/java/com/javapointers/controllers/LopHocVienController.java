package com.javapointers.controllers;

import com.javapointers.models.CapNhatLopHocVienObject;
import com.javapointers.models.ILopHocVien;
import com.javapointers.models.ThemLopHocVienObject;
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
public class LopHocVienController {

    @Autowired
    ILopHocVien lopHocVien;

    @RequestMapping(value="/lop-hoc-vien", method = RequestMethod.GET)
    public String LopHocVien(){
        return "lophocvien";
    }


    @RequestMapping(value="/chi-tiet-lop-hoc-vien", method = RequestMethod.GET)
    public String ChiTietLopHocVien(@RequestParam("maLopHocVien") String maLopHocVien){
        List<Map<String, Object>> objListResult=lopHocVien.LayChiTietLopHocVien(maLopHocVien);
        return "chitietlophocvien";
    }

    @RequestMapping(value="/them-lop-hoc-vien", method = RequestMethod.POST)
    public String ThemLopHocVien(@RequestParam("tenLopHocVien") String tenLopHocVien, @RequestParam("soLuong") int soLuong, @RequestParam("giangVien") String giangVien, @RequestParam("maKhoaHoc")String maKhoaHoc){
        String maLopHocVien= UUID.randomUUID().toString();
        if(lopHocVien.ThemLopHocVien(new ThemLopHocVienObject(maLopHocVien, tenLopHocVien, soLuong, giangVien, maKhoaHoc))>1){
            return "SUCCESS";
        }
        else{
            return "FAIL";
        }
    }

    @RequestMapping(value="/cap-nhat-hoc-vien", method = RequestMethod.GET)
    public String CapNhatHocVien(){
        return "capnhathocvien";
    }

    @RequestMapping(value="/cap-nhat-hoc-vien", method = RequestMethod.PUT)
    public String CapNhatLopHocVien(@RequestParam("maLopHocVien") String maLopHocVien,@RequestParam("tenLopHocVien") String tenLopHocVien, @RequestParam("soLuong") int soLuong, @RequestParam("giangVien") String giangVien, @RequestParam("maKhoaHoc")String maKhoaHoc){
        if(lopHocVien.CapNhatLopHocVien(new CapNhatLopHocVienObject(maLopHocVien, tenLopHocVien, soLuong, giangVien, maKhoaHoc))>1){
            return "SUCCESS";
        }
        else{
            return "FAIL";
        }
    }

    @RequestMapping(value="/xoa-hoc-vien", method = RequestMethod.PUT)
    public String XoaLopHocVien(@RequestParam("maLopHocVien") String maLopHocVien){
        if(lopHocVien.XoaLopHocVien(maLopHocVien)>1){
            return "SUCCESS";
        }
        else{
            return "FAIL";
        }
    }

    @RequestMapping(value="/danh-sach-lop-hoc-vien", method = RequestMethod.GET)
    @ResponseBody
    public List<Map<String, Object>> LayDanhSachLopHocVien(HttpSession session, HttpServletResponse response, HttpServletRequest request) throws InterruptedException {
        List<Map<String, Object>> objListResult = lopHocVien.LayDanhSachLopHocVien();
        return objListResult;
    }


}
