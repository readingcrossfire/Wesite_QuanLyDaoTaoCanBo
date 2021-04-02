package VSC.jdbc;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Blob;
import java.sql.Clob;

import java.sql.Time;
import java.sql.Timestamp;
import java.sql.Types;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import oracle.jdbc.OracleTypes;

public class JdbcHelper {

    public static int getOracleType(String _char) {
        int oracle_type = 0;
        oracle_type = charToOracleTypeMap.get(_char);
        return oracle_type;
    }

    public static int getDataType(String paramType) {
        paramType = paramType.trim();
        paramType = paramType.substring(paramType.length() - 1);
        int dataType = 0;
        if (paramType.equalsIgnoreCase("i")) {
            dataType = Types.INTEGER;// 4 
        } else if (paramType.equalsIgnoreCase("l")) {
            dataType = Types.BIGINT;// -5;
        } else if (paramType.equalsIgnoreCase("d")) {
            dataType = Types.DOUBLE;// 8;
        } else if (paramType.equalsIgnoreCase("t")) {
            dataType = Types.DATE;// 91;
        } else if (paramType.equalsIgnoreCase("s")) {
            dataType = Types.VARCHAR;// 12;
        } else if (paramType.equalsIgnoreCase("nclob")) {
            dataType = Types.NCLOB;// 12;
        }
        return dataType;
    }

    /*
     SELECT 'paramTypeMap.put("{?=call '||
     LOWER(object_name)||'('||LISTAGG(DECODE(decode(position,0,null,data_type),'VARCHAR2','?','NVARCHAR2','?','CLOB','?','NUMBER','?','DATE','?','TIMESTAMP','?'), ',') WITHIN GROUP (ORDER BY position)
     ||')}","'||LISTAGG(DECODE(data_type,'VARCHAR2','s','NVARCHAR2','s','CLOB','s','NUMBER','l','DATE','t','TIMESTAMP','t','REF CURSOR','c',data_type), ',') WITHIN GROUP (ORDER BY position)||'");' AS data_type
     FROM  all_ARGUMENTS where owner='HIS_MANAGER' --WHERE position>0
     GROUP  BY  object_name;    
     */
    /*
     private static final Map<String,String> paramTypeMap = new HashMap();
     static
     {
     //HIS_LOGTRUYCAP
     paramTypeMap.put("{?=call ls_sudungchuongtrinh_select(?,?,?)}","c,t,t,s");
     }
     */
    private static final Map<String, Integer> charToOracleTypeMap = new HashMap();

    static {
        charToOracleTypeMap.put("s", OracleTypes.VARCHAR);
        charToOracleTypeMap.put("i", OracleTypes.NUMBER);
        charToOracleTypeMap.put("l", OracleTypes.NUMBER);
        charToOracleTypeMap.put("d", OracleTypes.NUMBER);
        charToOracleTypeMap.put("t", OracleTypes.DATE);
        charToOracleTypeMap.put("c", OracleTypes.CURSOR);
        charToOracleTypeMap.put("nclob", OracleTypes.CLOB);
    }
    private static final Map<Class<?>, Integer> javaTypeToOracleTypeMap = new HashMap(32);

    static {
        javaTypeToOracleTypeMap.put(String.class, OracleTypes.VARCHAR);
        javaTypeToOracleTypeMap.put(Byte.TYPE, OracleTypes.NUMBER);
        javaTypeToOracleTypeMap.put(Byte.class, OracleTypes.NUMBER);
        javaTypeToOracleTypeMap.put(Short.TYPE, OracleTypes.NUMBER);
        javaTypeToOracleTypeMap.put(Short.class, OracleTypes.NUMBER);
        javaTypeToOracleTypeMap.put(Integer.TYPE, OracleTypes.NUMBER);
        javaTypeToOracleTypeMap.put(Integer.class, OracleTypes.NUMBER);
        javaTypeToOracleTypeMap.put(Long.TYPE, OracleTypes.NUMBER);
        javaTypeToOracleTypeMap.put(Long.class, OracleTypes.NUMBER);
        javaTypeToOracleTypeMap.put(BigInteger.class, OracleTypes.NUMBER);
        javaTypeToOracleTypeMap.put(Float.TYPE, OracleTypes.NUMBER);
        javaTypeToOracleTypeMap.put(Float.class, OracleTypes.NUMBER);
        javaTypeToOracleTypeMap.put(Double.TYPE, OracleTypes.NUMBER);
        javaTypeToOracleTypeMap.put(Double.class, OracleTypes.NUMBER);
        javaTypeToOracleTypeMap.put(BigDecimal.class, OracleTypes.NUMBER);
        javaTypeToOracleTypeMap.put(java.sql.Date.class, OracleTypes.DATE);
        javaTypeToOracleTypeMap.put(Time.class, OracleTypes.TIME);
        javaTypeToOracleTypeMap.put(Timestamp.class, OracleTypes.TIMESTAMP);
        javaTypeToOracleTypeMap.put(Blob.class, OracleTypes.CLOB);
        javaTypeToOracleTypeMap.put(Clob.class, OracleTypes.BLOB);
        javaTypeToOracleTypeMap.put(List.class, OracleTypes.CURSOR);

    }
}
