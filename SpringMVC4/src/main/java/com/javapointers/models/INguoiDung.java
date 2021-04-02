/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.javapointers.models;

import java.util.List;

/**
 *
 * @author Tuan
 */
public interface INguoiDung {
    public List DangNhap(TaiKhoan taiKhoan);
    public List LayDanhSachNguoiDung();
}
