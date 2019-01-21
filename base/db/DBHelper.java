/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package give.base.db;

import com.mysql.jdbc.Connection;
import com.mysql.jdbc.PreparedStatement;
import give.base.model.BaseModel;
import give.core.model.CategoryModel;
import give.core.model.CharityModel;
import give.core.model.UserModel;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Arrays;

/**
 *
 * @author Administrator
 */
public abstract class DBHelper {
    
    DBConfig m_DBConfig = null;
    Connection m_DBConn = null;
    
    public DBHelper(DBConfig dbInf) {
        this.m_DBConfig = dbInf;
    }
    
    /**
     * &nbsp;openDB<br>
     * -----------------------------------------------------------------<br>
     * &nbsp;Create database connection.
     * 
     * @return 
     */
    public boolean openDB() {
        try {
            String url = String.format(
                    "jdbc:mysql://%s:%s/%s", 
                    this.m_DBConfig.getServer(), 
                    this.m_DBConfig.getPort(), 
                    this.m_DBConfig.getDatabase()
            );
            String username = this.m_DBConfig.getUserName();
            String password = this.m_DBConfig.getPassword();

            this.m_DBConn = (Connection) DriverManager.getConnection(url, username, password);
        } catch (SQLException ex) {
            // handle any errors
            System.out.println("Could not connecto the DB..." + ex.getMessage());
            return false;
        }
        
        return true;
    }
    
    
    /**
     * &nbsp;executeSQL<br>
     * -----------------------------------------------------------------<br>
     * &nbsp;Execute the SQL with specified parameters(values).
     * 
     * @param sql SQL to execute
     * @param values Parameters of SQL
     * 
     */
    public void executeSQL(String sql, ArrayList<Object> values) {
        PreparedStatement prpStmt = null;
        long nID = -1;
        try{
            boolean autoCommit = this.m_DBConn.getAutoCommit();            
            this.m_DBConn.setAutoCommit(false);
            
            prpStmt = (PreparedStatement) this.m_DBConn.prepareStatement(sql);
            if(values != null && values.size() > 0) {
                for(int i = 0; i < values.size(); i++) {
                    prpStmt.setObject(i + 1, values.get(i));
                }
            }
            prpStmt.execute();
            this.m_DBConn.commit();
            this.m_DBConn.setAutoCommit(autoCommit);
            
            nID = prpStmt.getLastInsertID();
        }
        catch(SQLException e) {
            System.out.println("Could not Run SQL: " + sql);
            System.out.println("Error: " + e.getMessage());
        }
        finally {
            try { if(prpStmt != null) prpStmt.close(); } catch (SQLException ignore) {}
        }
    }
    
    
    /**
     * 
     * @param sql
     * @param values
     * @param className
     * @return 
     */
    public ArrayList<BaseModel> executeSQLAndReturnArray(String sql, Object[] values, String className) {
        ArrayList<Object> params = new ArrayList<>();
        
        if(values != null && values.length > 0) {
            params.addAll(Arrays.asList(values));
        }
        
        return executeSQLAndReturnArray(sql, params, className);
    }
    
    /**
     * 
     * @param sql
     * @param values
     * @param className
     * @return 
     */
    public ArrayList<BaseModel> executeSQLAndReturnArray(String sql, ArrayList<Object> values, String className) {
        ArrayList<BaseModel> arrRecords = new ArrayList<>();
        
        PreparedStatement prpStmt = null;
        long nID = -1;
        try{
            boolean autoCommit = this.m_DBConn.getAutoCommit();            
            this.m_DBConn.setAutoCommit(false);
            
            prpStmt = (PreparedStatement) this.m_DBConn.prepareStatement(sql);
            if(values != null && values.size() > 0) {
                for(int i = 0; i < values.size(); i++) {
                    prpStmt.setObject(i + 1, values.get(i));
                }
            }
            
            ResultSet rs = prpStmt.executeQuery();
            try {
                while ( rs.next() ) {
                    if(className.compareTo(UserModel.class.getSimpleName()) == 0) {
                        UserModel element = new UserModel(rs);
                        
                        arrRecords.add(element);
                    }
                    else if(className.compareTo(CharityModel.class.getSimpleName()) == 0) {
                        CharityModel element = new CharityModel(rs);

                        arrRecords.add(element);
                    }
                    else if(className.compareTo(CategoryModel.class.getSimpleName()) == 0) {
                        CategoryModel element = new CategoryModel(rs);

                        arrRecords.add(element);
                    }
                }
            } 
            finally {
                try { rs.close(); } catch (SQLException ignore) {}
            }
            
            
            this.m_DBConn.commit();
            this.m_DBConn.setAutoCommit(autoCommit);
            
            nID = prpStmt.getLastInsertID();
        }
        catch(SQLException e) {
            System.out.println("Could not Run SQL: " + sql);
            System.out.println("Error: " + e.getMessage());
        }
        finally {
            try { if(prpStmt != null) prpStmt.close(); } catch (SQLException ignore) {}
        }
        
        return arrRecords;
    }
    
    
    public long insertRowByPreparedStatement(String strInsertSQL, Object[] values) {
        ArrayList<Object> params = new ArrayList<>();
        
        if(values != null && values.length > 0) {
            params.addAll(Arrays.asList(values));
        }
        
        return insertRowByPreparedStatement(strInsertSQL, params);
    }
    
    /**
     * &nbsp;insertRowByPreparedStatement<br>
     * -----------------------------------------------------------------<br>
     * &nbsp;Insert one row data with values.<br>
     * &nbsp;SQL must be the INSERT Statement.
     * 
     * @param strInsertSQL INSERT SQL Statement.
     * @param values Parameters of SQL
     * @return Inserted ID
     */
    public long insertRowByPreparedStatement(String strInsertSQL, ArrayList<Object> values) {        
        if(values == null || values.isEmpty() ) return -1;
        
        PreparedStatement prpStmt = null;
        long nID = -1;
        try{
            boolean autoCommit = this.m_DBConn.getAutoCommit();            
            this.m_DBConn.setAutoCommit(false);
            
            prpStmt = (PreparedStatement) this.m_DBConn.prepareStatement(strInsertSQL);
            for(int i = 0; i < values.size(); i++) {
                Object obj = values.get(i);
                if(obj.getClass().getSimpleName().equalsIgnoreCase("String")) {
                    obj = this.removeInvalidString((String)obj);
                }
                prpStmt.setObject(i + 1, obj);
            }
            prpStmt.execute();
            this.m_DBConn.commit();
            this.m_DBConn.setAutoCommit(autoCommit);
            
            nID = prpStmt.getLastInsertID();
        }
        catch(SQLException e) {
            System.out.println("Could not Insert Run SQL: " + strInsertSQL);
            System.out.println("Error: " + e.getMessage());
        }
        finally {
            try { if(prpStmt != null) prpStmt.close(); } catch (SQLException ignore) {}
        }
        
        return nID;
    }
    
    
    /**
     * &nbsp;insertRowsByPreparedStatement<br>
     * -----------------------------------------------------------------<br>
     * &nbsp;Insert multiple row data with values.<br>
     * &nbsp;SQL must be the INSERT Statement.
     * 
     * @param strInsertSQL INSERT SQL Statement.
     * @param rows Parameters of SQL.
     * @return 
     */
    public boolean insertRowsByPreparedStatement(String strInsertSQL, ArrayList<ArrayList<Object>> rows) {        
        if(rows == null || rows.isEmpty() ) return false;
        
        boolean success = false;
        PreparedStatement prpStmt = null;
        try{
            boolean autoCommit = this.m_DBConn.getAutoCommit();            
            this.m_DBConn.setAutoCommit(false);
            
            prpStmt = (PreparedStatement) this.m_DBConn.prepareStatement(strInsertSQL);
            for(int i = 0; i < rows.size(); i++) {
                ArrayList<Object> rowData = rows.get(i);
                
                for(int j = 0; j < rowData.size(); j++) {
                    Object obj = rowData.get(j);
                    if( obj.getClass().getSimpleName().equalsIgnoreCase("String")) {
                        obj = this.removeInvalidString((String)obj);
                    }
                    prpStmt.setObject(j + 1, obj);
                }
                
                prpStmt.addBatch();
            }
            prpStmt.executeBatch();            
            this.m_DBConn.commit();
            this.m_DBConn.setAutoCommit(autoCommit);
            
            success = true;
        }
        catch(SQLException e) {
            System.out.println("Could not Run Insert Batch SQL: " + strInsertSQL);
            System.out.println("Error: " + e.getMessage());
        }
        finally {
            try { if(prpStmt != null) prpStmt.close(); } catch (SQLException ignore) {}
        }
        
        return success;
    }
    
    
    /**
     * 
     * @param strSQL
     * @param values
     * @return 
     */
    public boolean updateRowByPreparedStatement(String strSQL, Object[] values) {
        ArrayList<Object> params = new ArrayList<>();
        
        if(values != null && values.length > 0) {
            params.addAll(Arrays.asList(values));
        }
        
        return updateRowByPreparedStatement(strSQL, params);
    }
            
    /**
     * &nbsp;updateRowByPreparedStatement<br>
     * -----------------------------------------------------------------<br>
     * &nbsp;Update only one row with row data values.<br>
     * &nbsp;SQL must be UPDATE statement.
     * 
     * @param strSQL SQL UPDATE Statement
     * @param values Values to update
     * @return Success ? true Else false
     */
    public boolean updateRowByPreparedStatement(String strSQL, ArrayList<Object> values) {        
        if(values == null || values.isEmpty() ) return false;
        
        boolean success = true;
        PreparedStatement prpStmt = null;
        try{
            boolean autoCommit = this.m_DBConn.getAutoCommit();            
            this.m_DBConn.setAutoCommit(false);
            
            prpStmt = (PreparedStatement) this.m_DBConn.prepareStatement(strSQL);
            for(int i = 0; i < values.size(); i++) {
                Object obj = values.get(i);
                if(obj.getClass().getSimpleName().equalsIgnoreCase("String")) {
                    obj = this.removeInvalidString((String)obj);
                }
                prpStmt.setObject(i + 1, obj);
            }
            prpStmt.execute();            
            this.m_DBConn.commit();
            this.m_DBConn.setAutoCommit(autoCommit);            
        }
        catch(SQLException e) {
            System.out.println("Could not Run Update SQL: " + strSQL);
            System.out.println("Error: " + e.getMessage());
            success = false;
        }
        finally {
            try { if(prpStmt != null) prpStmt.close(); } catch (SQLException ignore) {}
        }
        
        return success;
    }
    
    
    /**
     * &nbsp;updateRowsByPreparedStatement<br>
     * -----------------------------------------------------------------<br>
     * &nbsp;Update multiple rows with row data values.<br>
     * &nbsp;SQL must be UPDATE statement.
     * 
     * @param strSQL SQL UPDATE Statement
     * @param rows Values to update
     * @return Success ? true Else false
     */
    public boolean updateRowsByPreparedStatement(String strSQL, ArrayList<ArrayList<Object>> rows) {        
        if(rows == null || rows.isEmpty() ) return false;
        
        boolean success = false;
        PreparedStatement prpStmt = null;
        try{
            boolean autoCommit = this.m_DBConn.getAutoCommit();            
            this.m_DBConn.setAutoCommit(false);
            
            prpStmt = (PreparedStatement) this.m_DBConn.prepareStatement(strSQL);
            for(int i = 0; i < rows.size(); i++) {
                ArrayList<Object> rowData = rows.get(i);
                
                for(int j = 0; j < rowData.size(); j++) {
                    Object obj = rowData.get(j);
                    if(obj.getClass().getSimpleName().equalsIgnoreCase("String")) {
                        obj = this.removeInvalidString((String)obj);
                    }
                    prpStmt.setObject(j + 1, obj);
                }
                prpStmt.addBatch();
            }
            prpStmt.executeBatch();            
            this.m_DBConn.commit();
            this.m_DBConn.setAutoCommit(autoCommit);
            
            success = true;
        }
        catch(SQLException e) {
            System.out.println("Could not Run Update Batch SQL: " + strSQL);
            System.out.println("Error: " + e.getMessage());
        }
        finally {
            try { if(prpStmt != null) prpStmt.close(); } catch (SQLException ignore) {}
        }
        
        return success;
    }    
    
    
    /**
     * &nbsp;closeDB<br>
     * -----------------------------------------------------------------<br>
     * &nbsp;Close database connection.
     * 
     * 
     */
    public void closeDB() {
        try {
            if(this.m_DBConn != null && !this.m_DBConn.isClosed()) {
                this.m_DBConn.close();
                this.m_DBConn = null;
            }
        } catch (SQLException ex) {
            // handle any errors
            System.out.println("Could not close the DB..." + ex.getMessage());
        }
    }
    
    
    /**
     * &nbsp;escapeNullString<br>
     * -----------------------------------------------------------------<br>
     * &nbsp;Replace NULL or "null" as ""
     * 
     * @param obj
     * @return 
     */
    protected String escapeNullString(Object obj) {
        if(obj == null || obj.equals("null")) {
            return "";
        }
        
        return obj.toString().trim();
    }
    
    private String removeInvalidString(String str) {
        String strTemp = str.replaceAll("([\\ud800-\\udbff]|[\\udc00-\\udfff]|[\\uFFFD])", " ");
        String strRet =  strTemp.replaceAll(
                    "([\\xC0-\\xDF]|[\\x80-\\xBF])", " ");
        
        return strRet;
    }
}
