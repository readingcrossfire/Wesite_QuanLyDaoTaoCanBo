package com.javapointers.models;

import java.util.List;
import java.util.Map;

public interface IKhoaHoc {
    public int TaoKhoaHoc(ThemKhoaHocObject model);
    public int CapNhatKhoaHoc(CapNhatKhoaHocObject model);
    public int XoaKhoaHoc(String maKhoaHoc);
    public List<Map<String, Object>> LayDanhSachKhoaHoc();
    public List<Map<String, Object>> ChiTietKhoaHoc(String maKhoaHoc);
    public List<Map<String, Object>> LayDanhSachKetQuaKhoaHoc();

}
