package VSC.jdbc;

import com.javapointers.controllers.NguoiDungController;
import com.zaxxer.hikari.HikariDataSource;
import oracle.jdbc.OracleTypes;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.SingleColumnRowMapper;
import org.springframework.jdbc.core.SqlProvider;
import org.springframework.jdbc.datasource.ConnectionProxy;
import org.springframework.jdbc.datasource.DataSourceUtils;
import org.springframework.jdbc.support.JdbcUtils;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.util.LinkedCaseInsensitiveMap;

import javax.sql.DataSource;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.math.BigDecimal;
import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static VSC.jdbc.JdbcHelper.getOracleType;


public class JdbcTemplate extends org.springframework.jdbc.core.JdbcTemplate{

    public JdbcTemplate() {
    }

    public JdbcTemplate(DataSource dataSource) {
        super(dataSource);
    }

    public JdbcTemplate(DataSource dataSource, boolean lazyInit) {
        super(dataSource, lazyInit);
    }

    @Override
    public List<Map<String, Object>> queryForList(String sql) throws DataAccessException {
        if (sql.startsWith("call ")) {
            return call_sp(sql, new Object[]{}, List.class);
        } else {
            return super.queryForList(sql);
        }
        //return queryForList(sql,new Object[]{});
    }

    @Override
    public List<Map<String, Object>> queryForList(String sql, Object... args) throws DataAccessException {
        //return query(sql, args);
        if (NguoiDungController.isLocalHost) {
            System.out.println("queryForList=" + sql);
            for (int i = 0; i < args.length; i++) {
                System.out.println("args[" + i + "]=" + args[i]);
            }
        }
        if (sql.startsWith("call ")) {
            return call_sp(sql, args, List.class);
        } else {
            return super.queryForList(sql, args);
        }
    }

    @Override
    public SqlRowSet queryForRowSet(String sql, Object... args) throws DataAccessException {
        //return query(sql, args);
        if (NguoiDungController.isLocalHost) {
            System.out.println("queryForRowSet=" + sql);
            for (int i = 0; i < args.length; i++) {
                System.out.println("args[" + i + "]=" + args[i]);
            }
        }
        if (sql.startsWith("call ")) {
            return call_sp(sql, args, SqlRowSet.class);
        } else {
            return super.queryForRowSet(sql, args);
        }
    }

    @Override
    public <T> T queryForObject(String sql, Object[] args, Class<T> requiredType) throws DataAccessException {
        if (NguoiDungController.isLocalHost) {
            System.out.println("queryForObject=" + sql);
        }
        if (sql.startsWith("call ")) {
            T results = (T) call_sp(sql, args, requiredType);
            if (NguoiDungController.isLocalHost) {
                System.out.println("queryForObject.return=" + results);
            }
            return results;
        } else {
            return (T) super.queryForObject(sql, args, new SingleColumnRowMapper<T>(requiredType));
        }
    }

    @Override
    public <T> T queryForObject(String sql, Class<T> requiredType) throws DataAccessException {
        return queryForObject(sql, new Object[]{}, requiredType);
    }

    public int queryForInt(String sql, Object[] args) throws DataAccessException {
        Number number = (Number) queryForObject(sql, args, Integer.class);
        return number != null ? number.intValue() : 0;
    }

    public long queryForLong(String sql, Object[] args) throws DataAccessException {
        Number number = (Number) queryForObject(sql, args, Long.class);
        return number != null ? number.longValue() : 0;
    }

    @Override
    public Map<String, Object> queryForMap(String sql, Object[] args) throws DataAccessException {
        //return (Map)queryForObject(sql, args, getColumnMapRowMapper());
        if (NguoiDungController.isLocalHost) {
            System.out.println("queryForMap=" + sql);
        }
        if (sql.startsWith("call ")) {
            List results = (List) call_sp(sql, args, List.class);
            int size = results != null ? results.size() : 0;
            if (size == 0) {
                return null;
            } else {
                return (Map) results.iterator().next();
            }
        } else {
            return super.queryForMap(sql, args);
        }
    }

    @Override
    public int update(final String sql)
            throws DataAccessException {
        return update(sql, new Object[]{});
    }

    @Override
    public int update(final String sql, Object... args)
            throws DataAccessException {
        if (NguoiDungController.isLocalHost) {
            System.out.println("update=" + sql);
        }
        if (sql.startsWith("call ")) {
            Integer results = (Integer) call_sp(sql, args, Integer.class);
            return results;
        } else {
            return super.update(sql, args);
        }
    }
    private class CloseSuppressingInvocationHandler implements InvocationHandler {

        private final Connection target;

        public CloseSuppressingInvocationHandler(Connection target) {
            this.target = target;
        }

        @Override
        @SuppressWarnings("rawtypes")
        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
            // Invocation on ConnectionProxy interface coming in...

            if (method.getName().equals("equals")) {
                // Only consider equal when proxies are identical.
                return (proxy == args[0]);
            }
            else if (method.getName().equals("hashCode")) {
                // Use hashCode of PersistenceManager proxy.
                return System.identityHashCode(proxy);
            }
            else if (method.getName().equals("unwrap")) {
                if (((Class) args[0]).isInstance(proxy)) {
                    return proxy;
                }
            }
            else if (method.getName().equals("isWrapperFor")) {
                if (((Class) args[0]).isInstance(proxy)) {
                    return true;
                }
            }
            else if (method.getName().equals("close")) {
                // Handle close method: suppress, not valid.
                return null;
            }
            else if (method.getName().equals("isClosed")) {
                return false;
            }
            else if (method.getName().equals("getTargetConnection")) {
                // Handle getTargetConnection method: return underlying Connection.
                return this.target;
            }

            // Invoke method on target Connection.
            try {
                Object retVal = method.invoke(this.target, args);

                // If return value is a JDBC Statement, apply statement settings
                // (fetch size, max rows, transaction timeout).
                if (retVal instanceof Statement) {
                    applyStatementSettings(((Statement) retVal));
                }

                return retVal;
            }
            catch (InvocationTargetException ex) {
                throw ex.getTargetException();
            }
        }
    }

    protected Connection createConnectionProxy(Connection con) {
        return (Connection) Proxy.newProxyInstance(
                ConnectionProxy.class.getClassLoader(),
                new Class<?>[] {ConnectionProxy.class},
                new CloseSuppressingInvocationHandler(con));
    }

    public <T> T call_sp(String prc_name, Object[] sp_param, Class<T> returnType) {
        CallableStatement cs = null;
        Object rt = null;

        // Close connection sao khi thuc hien xong
        try(Connection conToUse = getDataSource().getConnection()) {

            String[] name_type = prc_name.split("#");
            String sp_name = "{?=" + name_type[0].toLowerCase() + "}";
            String parType = "";
            if (name_type.length > 1) {
                parType = name_type[1];


            }
            String[] param = parType.split(",");
            cs = conToUse.prepareCall(sp_name);
            int oracle_type = getOracleType(param[0]);
            cs.registerOutParameter(1, oracle_type);
            setParamValue(cs, sp_name, parType, sp_param);
            cs.executeUpdate();
            rt = getReturnValue(cs, returnType, oracle_type);

        } catch (SQLException e) {
//            DataSourceUtils.releaseConnection(con, getDataSource());
//            con = null;
            throw getExceptionTranslator().translate("ConnectionCallback",prc_name ,e);
        }
        return (T) rt;
    }

//    public <T> T call_sp(String prc_name, Object[] sp_param, Class<T> returnType) {
//        CallableStatement cs = null;
//        Object rt = null;
//
//        Connection con = DataSourceUtils.getConnection(getDataSource());
//        try {
//            Connection conToUse = this.createConnectionProxy(con);
//
//            String[] name_type = prc_name.split("#");
//            String sp_name = "{?=" + name_type[0].toLowerCase() + "}";
//            String parType = "";
//            if (name_type.length > 1) {
//                parType = name_type[1];
//            }
//            String[] param = parType.split(",");
//            cs = conToUse.prepareCall(sp_name);
//            int oracle_type = getOracleType(param[0]);
//            cs.registerOutParameter(1, oracle_type);
//            setParamValue(cs, sp_name, parType, sp_param);
//            cs.executeUpdate();
//            rt = getReturnValue(cs, returnType, oracle_type);
//
//        } catch (SQLException e) {
//            DataSourceUtils.releaseConnection(con, getDataSource());
////            con = null;
//            throw getExceptionTranslator().translate("ConnectionCallback",prc_name ,e);
//        } finally {
//            con = null;
//            DataSourceUtils.releaseConnection(con, getDataSource());
//        }
//        return (T) rt;
//    }

    private static String getSql(Object sqlProvider) {
        if (sqlProvider instanceof SqlProvider) {
            return ((SqlProvider) sqlProvider).getSql();
        }
        else {
            return null;
        }
    }

    public Object getReturnValue(CallableStatement cs, Class<?> requiredType, int return_type)
            throws SQLException {

        Object value = null;
        int index = 1;
        if (return_type != OracleTypes.CURSOR) {
            if (String.class.equals(requiredType)) {
                value = cs.getString(index);
            } else if ((Boolean.TYPE.equals(requiredType)) || (Boolean.class.equals(requiredType))) {
                value = Boolean.valueOf(cs.getBoolean(index));
            } else if ((Byte.TYPE.equals(requiredType)) || (Byte.class.equals(requiredType))) {
                value = Byte.valueOf(cs.getByte(index));
            } else if ((Short.TYPE.equals(requiredType)) || (Short.class.equals(requiredType))) {
                value = Short.valueOf(cs.getShort(index));
            } else if ((Integer.TYPE.equals(requiredType)) || (Integer.class.equals(requiredType))) {
                value = Integer.valueOf(cs.getInt(index));
            } else if ((Long.TYPE.equals(requiredType)) || (Long.class.equals(requiredType))) {
                value = Long.valueOf(cs.getLong(index));
            } else if ((Float.TYPE.equals(requiredType)) || (Float.class.equals(requiredType))) {
                value = Float.valueOf(cs.getFloat(index));
            } else if ((Double.TYPE.equals(requiredType)) || (Double.class.equals(requiredType))
                    || (Number.class.equals(requiredType))) {
                value = Double.valueOf(cs.getDouble(index));
            } else if (byte[].class.equals(requiredType)) {
                value = cs.getBytes(index);
            } else if (java.sql.Date.class.equals(requiredType)) {
                value = cs.getDate(index);
            } else if (Time.class.equals(requiredType)) {
                value = cs.getTime(index);
            } else if ((Timestamp.class.equals(requiredType)) || (java.util.Date.class.equals(requiredType))) {
                value = cs.getTimestamp(index);
            } else if (BigDecimal.class.equals(requiredType)) {
                value = cs.getBigDecimal(index);
            } else if (Blob.class.equals(requiredType)) {
                value = cs.getBlob(index);
            } else if (Clob.class.equals(requiredType)) {
                value = cs.getClob(index);
            } else {
                value = cs.getString(index);
            }
        } else {
            if (List.class.equals(requiredType)) {
                ResultSet rs = (ResultSet) cs.getObject(index);
                value = extractData(rs);
                JdbcUtils.closeResultSet(rs);
            } else {
                if (NguoiDungController.isLocalHost) {
                    System.out.println("\n\n\nextractValue");
                }
                ResultSet rs = (ResultSet) cs.getObject(index);
                value = extractValue(rs, 1, requiredType);
                JdbcUtils.closeResultSet(rs);
            }
        }
        return value;
    }

    public Object extractValue(ResultSet rs, int index, Class<?> requiredType) throws SQLException {
        Object results = null;
        int rowNum = 0;
        if (rs.next()) {
            results = JdbcUtils.getResultSetValue(rs, index, requiredType);
        }
        return results;
    }

    public Map<String, Object> mapRow(ResultSet rs, int rowNum) throws SQLException {
        ResultSetMetaData rsmd = rs.getMetaData();
        int columnCount = rsmd.getColumnCount();
        Map<String, Object> mapOfColValues = new LinkedCaseInsensitiveMap(columnCount);
        for (int i = 1; i <= columnCount; i++) {
            String key = JdbcUtils.lookupColumnName(rsmd, i);
            Object obj = JdbcUtils.getResultSetValue(rs, i);
            //mapOfColValues.put(key.toLowerCase(), obj);
            mapOfColValues.put(key, obj);
        }
        return mapOfColValues;
    }


    public List extractData(ResultSet rs) throws SQLException {
        List results = new ArrayList();
        int rowNum = 0;
        while (rs.next()) {
            results.add(mapRow(rs, rowNum++));
            //JdbcUtils.getResultSetValue(rs, index);
        }
        return results;
    }

    public void setParamValue(CallableStatement cs, String func, String parType, Object[] sp_param) {
        try {
            //String parType=JdbcHelper.getParamType(func);
            //System.out.println("func="+parType);
            String[] param = parType.split(",");
            if (sp_param != null && sp_param.length > 0) {

                for (int i = 0; i < sp_param.length; i++) {
                    if (sp_param[i] == null) {
                        int dataType = JdbcHelper.getDataType(param[i + 1]);
                        cs.setNull(2 + i, dataType);
                        if (NguoiDungController.isLocalHost) {
                            System.out.println("cs.setNull(" + (2 + i) + ")=" + param[i + 1]);
                        }
                        //logger.info((new StringBuilder("sp_param[")).append(2 + i).append(":").append(param[i]).append("]=").append(sp_param[i]).toString());
                    } else {
                        //logger.info((new StringBuilder("sp_param[")).append(2 + i).append(":").append(sp_param[i].getClass().getName()).append("]=").append(sp_param[i]).toString());
                        String prType = param[i + 1];
                        //l,l,s,t,l,l,l,s,s,s,s,l,s
                        if (sp_param[i] instanceof String) {
                            if (prType.equalsIgnoreCase("s")) {
                                cs.setString(2 + i, "" + sp_param[i]);
                                if (NguoiDungController.isLocalHost) {
                                    System.out.println("cs.setString(" + (2 + i) + ")=" + sp_param[i]);
                                }
                            } else if (prType.equalsIgnoreCase("i")) {
                                cs.setInt(2 + i, Integer.parseInt("" + sp_param[i]));
                                if (NguoiDungController.isLocalHost) {
                                    System.out.println("cs.setInt(" + (2 + i) + ")=" + sp_param[i]);
                                }
                            } else if (prType.equalsIgnoreCase("b")) {
                                cs.setInt(2 + i, Boolean.parseBoolean("" + sp_param[i]) ? 1 : 0);
                                if (NguoiDungController.isLocalHost) {
                                    System.out.println("cs.setBoolean(" + (2 + i) + ")=" + sp_param[i]);
                                }
                            } else if (prType.equalsIgnoreCase("l")) {
                                cs.setLong(2 + i, Long.parseLong("" + sp_param[i]));
                                if (NguoiDungController.isLocalHost) {
                                    System.out.println("cs.setLong(" + (2 + i) + ")=" + sp_param[i]);
                                }
                            } else if (prType.equalsIgnoreCase("f")) {
                                cs.setFloat(2 + i, Float.parseFloat("" + sp_param[i]));
                                if (NguoiDungController.isLocalHost) {
                                    System.out.println("cs.setFloat(" + (2 + i) + ")=" + sp_param[i]);
                                }
                            } else if (prType.equalsIgnoreCase("d")) {
                                cs.setDouble(2 + i, Double.parseDouble("" + sp_param[i]));
                                if (NguoiDungController.isLocalHost) {
                                    System.out.println("cs.setDouble(" + (2 + i) + ")=" + sp_param[i]);
                                }
                            } else if (prType.equalsIgnoreCase("t")) {
                                String fmt = "yyyy-MM-dd HH:mm:ss";
                                if (("" + sp_param[i]).length() == 10) {
                                    fmt = "yyyy-MM-dd";
                                } else if (("" + sp_param[i]).length() > 10 && ("" + sp_param[i]).length() < 19) {
                                    fmt = "yyyy-MM-dd";
                                } else if (("" + sp_param[i]).length() > 19) {
                                    fmt = "yyyy-MM-dd HH:mm:ss.SSS";
                                }
                                //System.out.println("bi forrr: fmt="+fmt+"|");
                                SimpleDateFormat sdf = new SimpleDateFormat(fmt);

                                java.sql.Date myd = new java.sql.Date(sdf.parse("" + sp_param[i]).getTime());
                                //System.out.println("bi forrr: fmt="+fmt+"|");

                                //cs.setTimestamp(2 + i, new Timestamp(myd.getTime()));
                                cs.setDate(2 + i, myd);
                                if (NguoiDungController.isLocalHost) {
                                    System.out.println("cs.setDate(" + (2 + i) + ")=" + sp_param[i]);
                                }
                            } else {
                                if (NguoiDungController.isLocalHost) {
                                    System.out.println("cs.UNKNOW.prType=" + prType + "(" + (2 + i) + ")=" + sp_param[i]);
                                }
                            }
                        } else {
                            if (sp_param[i] instanceof Integer) {
                                cs.setInt(2 + i, ((Integer) sp_param[i]).intValue());
                                if (NguoiDungController.isLocalHost) {
                                    System.out.println("cs.setInt(" + (2 + i) + ")=" + sp_param[i]);
                                }
                            } else if (sp_param[i] instanceof Long) {
                                cs.setLong(2 + i, ((Long) sp_param[i]).longValue());
                                if (NguoiDungController.isLocalHost) {
                                    System.out.println("cs.setLong(" + (2 + i) + ")=" + sp_param[i]);
                                }
                            } else if (sp_param[i] instanceof Float) {
                                cs.setFloat(2 + i, ((Float) sp_param[i]).floatValue());
                                if (NguoiDungController.isLocalHost) {
                                    System.out.println("cs.setFloat(" + (2 + i) + ")=" + sp_param[i]);
                                }
                            } else if (sp_param[i] instanceof Double) {
                                cs.setDouble(2 + i, ((Double) sp_param[i]).doubleValue());
                                if (NguoiDungController.isLocalHost) {
                                    System.out.println("cs.setDouble(" + (2 + i) + ")=" + sp_param[i]);
                                }
                            } else if (sp_param[i] instanceof Boolean) {
                                cs.setInt(2 + i, ((Boolean) sp_param[i]) ? 1 : 0);
                                if (NguoiDungController.isLocalHost) {
                                    System.out.println("cs.setBoolean(" + (2 + i) + ")=" + sp_param[i]);
                                }
                            } else if (sp_param[i] instanceof Date) {
                                cs.setDate(2 + i, (Date) sp_param[i]);
                                if (NguoiDungController.isLocalHost) {
                                    System.out.println("cs.setDate(" + (2 + i) + ")=" + sp_param[i]);
                                }
                            } else if (sp_param[i] instanceof Timestamp) {
                                cs.setTimestamp(2 + i, (Timestamp) sp_param[i]);
                                if (NguoiDungController.isLocalHost) {
                                    System.out.println("cs.setTimestamp(" + (2 + i) + ")=" + sp_param[i]);
                                }
                            } else if (sp_param[i] instanceof java.util.Date) {
                                java.util.Date d1 = (java.util.Date) sp_param[i];
                                //cs.setTimestamp(2 + i, new Timestamp(d1.getTime()));
                                java.sql.Date d2 = new java.sql.Date(d1.getTime());
                                cs.setDate(2 + i, d2);
                                if (NguoiDungController.isLocalHost) {
                                    System.out.println("cs.setDate(" + (2 + i) + ")=" + sp_param[i]);
                                }
                            } else if (sp_param[i] instanceof String) {
                                cs.setString(2 + i, (String) sp_param[i]);
                                if (NguoiDungController.isLocalHost) {
                                    System.out.println("cs.setString(" + (2 + i) + ")=" + sp_param[i]);
                                }
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
