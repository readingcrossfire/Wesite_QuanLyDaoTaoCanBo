package com.javapointers.models;

import VSC.jdbc.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.util.List;
import java.util.Map;

public class LopHocVien implements ILopHocVien{
    @Autowired
    @Resource(name = "dataSource")
    DataSource dataSource;

    @Override
    public List<Map<String, Object>> LayDanhSachLopHocVien() {
        String sql = "call LayDanhSachLopHocVien#c";
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        List<Map<String, Object>> result=jdbcTemplate.queryForList(sql, new Object[]{});
        return result;
    }

    @Override
    public List<Map<String, Object>>  LayDanhSachLopHocVienTheoKhoaHoc(String maKhoaHoc) {
        String sql = "call LayDSLHVTheoKhoaHoc#c, s";
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        List<Map<String, Object>> result=jdbcTemplate.queryForList(sql, new Object[]{maKhoaHoc});
        return result;
    }

    @Override
    public List LayChiTietLopHocVien(String maLopHocVien) {
        String sql = "call LayChiTietLopHocVien#c, s";
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        List<Map<String, Object>> result=jdbcTemplate.queryForList(sql, new Object[]{maLopHocVien});
        return result;
    }

    @Override
    public int ThemLopHocVien(ThemLopHocVienObject model) {
        String sql = "call ThemLopHocVien(?,?,?,?,?)#i, s, s, i, s";
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        int result=jdbcTemplate.queryForInt(sql, new Object[]{model.MaLopHocVien, model.TenLopHocVien, model.SoLuong, model.GiangVien, model.MaKhoaHoc});
        return result;
    }

    @Override
    public int CapNhatLopHocVien(CapNhatLopHocVienObject model) {
        String sql = "call CapNhatLopHocVien(?,?,?,?,?)#i, s, s, i, s";
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        int result=jdbcTemplate.queryForInt(sql, new Object[]{model.MaLopHocVien, model.TenLopHocVien, model.SoLuong, model.GiangVien, model.MaKhoaHoc});
        return result;
    }

    @Override
    public int XoaLopHocVien(String maLopHocVien) {
        String sql = "call XoaLopHocVien(?)#i, s";
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        int result=jdbcTemplate.queryForInt(sql, new Object[]{maLopHocVien});
        return result;
    }
}
