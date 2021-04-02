package com.javapointers.models;

import java.util.List;

public interface ILopHocVien {
    public List LayDanhSachLopHocVien();
    public List LayDanhSachLopHocVienTheoKhoaHoc(String maKhoaHoc);
    public List LayChiTietLopHocVien(String maLopHocVien);
    public int ThemLopHocVien(ThemLopHocVienObject model);
    public int CapNhatLopHocVien(CapNhatLopHocVienObject model);
    public int XoaLopHocVien(String maLopHocVien);

}
