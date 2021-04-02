/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package tienich;
import java.io.BufferedReader;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Clob;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * @author NguyenHoanTuan
 */

public class tienich {

    public static boolean isNumeric(String str) {
        return str.matches("-?\\d+(\\.\\d+)?");  //match a number with optional '-' and decimal.
    }

    public static boolean isInteger(String s) {
        try {
            Integer.parseInt(s);
        } catch (NumberFormatException | NullPointerException e) {
            return false;
        }
        // only got here if we didn't return false
        return true;
    }

    public static String chuyenNgayMysql_Str(String str) {
        String day = "";
        if (!str.equals("")) {
            String[] arr = str.split("-");
            day = arr[2] + "/" + arr[1] + "/" + arr[0];
        }
        return day;
    }

    public static String chuyenNgayDateTime_Str(String str,String locNgayGio) {
        String day = "";
        if (!str.equals("")) {
            String[] arr = str.split("[-: ]");
            if(locNgayGio.equals("0"))
                day = arr[2] + "/" + arr[1] + "/" + arr[0];
            else
                day = arr[2] + "/" + arr[1] + "/" + arr[0] + " " + arr[3] +":"+arr[4]+":"+arr[5] ;
        }
        return day;
    }

    public static String chuyenNgayMysql_StrTime(String str) {
        String day = "";
        String date = "";
        String time = "";
        if (!str.equals("")) {
            date = str.substring(0, 10);
            time = str.substring(11, 19);
            String[] arr = date.split("-");

            day = time + ' ' + arr[2] + "/" + arr[1] + "/" + arr[0];
        }
        return day;
    }

    // AGG bổ sung cắt ngày thành chuỗi
    public static String chuyenDate_Var2(String str) {
        String day = "";
        if (!str.equals("")) {
            String[] arr = str.split("-");
            day = arr[2] + "" + arr[1] + "" + arr[0];
        }
        return day;
    }

    // AGG bổ sung cắt ngày thành chuỗi
    public static String congNgay(String str, int songay) {
        Calendar calendar = Calendar.getInstance();
        String[] arr = str.split("-");
        calendar.add(Calendar.DATE, songay);
        SimpleDateFormat simple = new SimpleDateFormat("yyyy-MM-dd");
        return simple.format(calendar.getTime());
    }

    public static String layngayhientai() {
        return new SimpleDateFormat("dd/MM/yyyy").format(new java.util.Date());
    }

    public static String layngaygiohientai() {
        return new SimpleDateFormat("dd/MM/yyyy HH:mm").format(new java.util.Date());
    }

    public static String laygiohientai() {
        return new SimpleDateFormat("HH:mm:ss").format(new java.util.Date());
    }

    public static String layngaydaunam() {
        String nam = new SimpleDateFormat("yyyy").format(new java.util.Date());
        return "01/01/" + nam;
    }

    public static String layNamHienTai() {
        return new SimpleDateFormat("yyyy").format(new java.util.Date());
    }

    public static String layngaydauthang() {
        String nam = new SimpleDateFormat("MM/yyyy").format(new java.util.Date());
        return "01/" + nam;
    }

    public static String layngaycuoinam_agg() {
        String nam = new SimpleDateFormat("yyyy").format(new java.util.Date());
        return "31/12/" + nam;
    }

    public static String getMD5(String str) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] messageDigest = md.digest(str.getBytes());
            BigInteger number = new BigInteger(1, messageDigest);
            String hashtext = number.toString(16);
            // Now we need to zero pad it if you actually want the full 32 chars.
            while (hashtext.length() < 32) {
                hashtext = "0" + hashtext;
            }
            return hashtext;
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    public static String encodePass(String pass_temp) {
        int pos = pass_temp.length() / 2;
        String start = pass_temp.substring(0, pos);
        String limit = pass_temp.substring(pos, pass_temp.length());
        String password = getMD5(start) + getMD5(limit);
        return password;
    }

    public static String convertDate(String string) {
        if (!string.equals("")) {
            String[] ngay_arr = string.split("/");
            if (ngay_arr.length != 1) {
                String date = ngay_arr[2] + "-" + ngay_arr[1] + "-" + ngay_arr[0];
                return date;
            } else {
                return string;
            }
        }
        return "";
// throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public static String layThu_Ngay(int ngay, int thang, int nam) {
        Calendar cal = Calendar.getInstance();
        cal.set(nam, thang - 1, ngay);
        String thu = "";
        switch (cal.get(Calendar.DAY_OF_WEEK)) {
            case 1:
                thu = "Chủ nhật";
                break;
            case 2:
                thu = "Thứ hai";
                break;
            case 3:
                thu = "Thứ ba";
                break;
            case 4:
                thu = "Thứ tư";
                break;
            case 5:
                thu = "Thứ năm";
                break;
            case 6:
                thu = "Thứ sáu";
                break;
            case 7:
                thu = "Thứ bảy";
                break;
        }
        return thu;
    }

    public static String clobToString(Clob data) {
        try {
            if (data == null) {
                return "";
            }

            StringBuilder str = new StringBuilder();
            String strng;

            BufferedReader bufferRead = new BufferedReader(data.getCharacterStream());

            while ((strng = bufferRead.readLine()) != null) {
                str.append(strng);
            }

            return str.toString();
        } catch (Exception e) {
            return "";
        }
    }

}
