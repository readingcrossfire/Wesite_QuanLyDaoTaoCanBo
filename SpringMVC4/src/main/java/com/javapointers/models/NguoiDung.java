/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.javapointers.models;


import VSC.jdbc.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.util.List;

/**
 * @author Tuan
 */

@Component
public class NguoiDung implements INguoiDung {

    @Autowired
    @Resource(name = "dataSource")
    DataSource dataSource;

    //DataSource dataSourceFW_config=ConfigDataSource.setDataSourceFW();
    @Override
    public List DangNhap(TaiKhoan taiKhoan) {
        String sql = "call DangNhap(?,?)#c,s,s";
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        return jdbcTemplate.queryForList(sql, new Object[]{taiKhoan.layTenDangNhap(), taiKhoan.layMatKhau()});
    }

    @Override
    public List LayDanhSachNguoiDung() {
        String sql="call LayDanhSachNguoiDung#c";
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        return jdbcTemplate.queryForList(sql,new Object());
    }

}
