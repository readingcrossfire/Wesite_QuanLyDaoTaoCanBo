package com.javapointers.models;

import VSC.jdbc.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.util.List;
import java.util.Map;

public class CanBo implements ICanBo{

    @Autowired
    @Resource(name = "dataSource")
    DataSource dataSource;

    @Override
    public int ThemCanBo(ThemCanBoObject model) {
        String sql = "call ThemCanBo(?,?,?,?)#i, s, s, s, s";
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        int result=jdbcTemplate.queryForInt(sql, new Object[]{model.MaCanBo, model.TenCanBo, model.ChucVu, model.PhongBan});
        return result;
    }

    @Override
    public int CapNhatCanBo(CapNhatCanBoObject model) {
        String sql = "call CapNhatCanBo(?,?,?,?)#i, s, s, s, s";
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        int result=jdbcTemplate.queryForInt(sql, new Object[]{model.MaCanBo, model.TenCanBo, model.ChucVu, model.PhongBan});
        return result;
    }

    @Override
    public int XoaCanBo(String maCanBo) {
        String sql = "call XoaCanBo(?)#i, s";
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        int result=jdbcTemplate.queryForInt(sql, new Object[]{maCanBo});
        return result;
    }

    @Override
    public List<Map<String, Object>> LayDanhSachCanBo() {
        String sql = "call LayDanhSachCanBo#c";
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        List<Map<String, Object>> result=jdbcTemplate.queryForList(sql, new Object[]{});
        return result;
    }
}
