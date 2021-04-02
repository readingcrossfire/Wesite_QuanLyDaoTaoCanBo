package com.javapointers.models;

import java.util.Date;

public class ThemKhoaHocObject {
    public String MaKhoaHoc;
    public String TenKhoaHoc;
    public Date ThoiGianBatDau;
    public Date ThoiGianKetThuc;
    public String DiaDiem;
    public int DuToan;

    public ThemKhoaHocObject(String maKhoaHoc, String tenKhoaHoc, Date thoiGianBatDau, Date thoiGianKetThuc, String diaDiem, int duToan){
        this.MaKhoaHoc=maKhoaHoc;
        this.TenKhoaHoc=tenKhoaHoc;
        this.ThoiGianBatDau=thoiGianBatDau;
        this.ThoiGianKetThuc=thoiGianKetThuc;
        this.DiaDiem=diaDiem;
        this.DuToan=duToan;
    }
}
