package com.javapointers.models;

import java.util.List;
import java.util.Map;

public interface ICanBo {
    public int ThemCanBo(ThemCanBoObject model);
    public int CapNhatCanBo(CapNhatCanBoObject model);
    public int XoaCanBo(String maCanBo);
    public List<Map<String, Object>> LayDanhSachCanBo();
}
