package com.javapointers.models;

public class TaiKhoan {
    private String TenDangNhap;
    private String MatKhau;

    public String layTenDangNhap() {
        return this.TenDangNhap;
    }

    public void ganTenDangNhap(String tenDangNhap) {
        this.TenDangNhap = tenDangNhap;
    }

    public String layMatKhau() {
        return this.MatKhau;
    }

    public void ganMatKhau(String matKhau) {
        this.MatKhau = matKhau;
    }
}
