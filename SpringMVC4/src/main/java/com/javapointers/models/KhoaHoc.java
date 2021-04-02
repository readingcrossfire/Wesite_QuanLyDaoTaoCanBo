package com.javapointers.models;

import VSC.jdbc.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.util.List;
import java.util.Map;

@Component
public class KhoaHoc implements IKhoaHoc {

    @Autowired
    @Resource(name = "dataSource")
    DataSource dataSource;

    @Override
    public int TaoKhoaHoc(ThemKhoaHocObject model) {
        String sql = "call ThemKhoaHoc(?,?,?,?,?,?)#i, s, s, s, t, t, s, i";
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        int result=jdbcTemplate.queryForInt(sql, new Object[]{model.MaKhoaHoc, model.TenKhoaHoc, model.ThoiGianBatDau, model.ThoiGianKetThuc, model.DiaDiem, model.DuToan});
        return result;
    }

    @Override
    public int CapNhatKhoaHoc(CapNhatKhoaHocObject model) {
        String sql = "call CapNhatKhoaHoc(?,?,?,?,?,?)#i, s, s, s, t, t, s, i";
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        int result=jdbcTemplate.queryForInt(sql, new Object[]{model.MaKhoaHoc, model.TenKhoaHoc, model.ThoiGianBatDau, model.ThoiGianKetThuc, model.DiaDiem, model.DuToan});
        return result;
    }

    @Override
    public int XoaKhoaHoc(String maKhoaHoc) {
        String sql = "call XoaKhoaHoc(?)#i, s";
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        int result=jdbcTemplate.queryForInt(sql, new Object[]{maKhoaHoc});
        return result;
    }

    @Override
    public List<Map<String, Object>> LayDanhSachKhoaHoc() {
        String sql = "call LayDanhSachKhoaHoc#c";
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        List<Map<String, Object>> result=jdbcTemplate.queryForList(sql, new Object[]{});
        return result;
    }

    @Override
    public List<Map<String, Object>> ChiTietKhoaHoc(String maKhoaHoc) {
        String sql = "call LayChiTietKhoaHoc(?)#c, s";
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        List<Map<String, Object>> result=jdbcTemplate.queryForList(sql, new Object[]{maKhoaHoc});
        return result;

    }

    @Override
    public List<Map<String, Object>> LayDanhSachKetQuaKhoaHoc() {
        String sql = "call LayKetQuaKhoaHoc()#c";
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        List<Map<String, Object>> result=jdbcTemplate.queryForList(sql, new Object[]{});
        return result;
    }
}
