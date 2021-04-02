package com.javapointers.models;

public class ThemLopHocVienObject {
    public String MaLopHocVien;
    public String TenLopHocVien;
    public int SoLuong;
    public String GiangVien;
    public String MaKhoaHoc;


    public ThemLopHocVienObject(String maLopHocVien, String tenLopHocVien, int soLuong, String giangVien, String maKhoaHoc){
        this.MaLopHocVien=maLopHocVien;
        this.TenLopHocVien=tenLopHocVien;
        this.SoLuong=soLuong;
        this.GiangVien=giangVien;
        this.MaKhoaHoc=maKhoaHoc;
    }
}
