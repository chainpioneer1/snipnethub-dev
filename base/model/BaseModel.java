/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package give.base.model;

import give.util.DateUtil;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;

/**
 *
 * @author Administrator
 */
public abstract class BaseModel {
    protected int m_nID;
    
    protected String m_strCreatedAt;
    protected String m_strUpdatedAt;
    
    public BaseModel() { 
        
    }
    
    public BaseModel(ResultSet rs) {
        this.m_nID = (Integer)this.getValueFrom(rs, "id", 0);
        this.m_strCreatedAt = (String)this.getValueFrom(rs, "created_at", "");
        this.m_strUpdatedAt = (String)this.getValueFrom(rs, "updated_at", "");        
    }
    
    public int getID() { return this.m_nID; }
    public void setID(int nParamID) { this.m_nID = nParamID; }    
    
    public String getCreatedAt() { return this.m_strCreatedAt; }
    public void setCreatedAt(String strParamCreatedAt) { this.m_strCreatedAt = strParamCreatedAt; }    
    public void setCreatedAt(Date dateParamCreatedAt) { this.m_strCreatedAt = DateUtil.dateToStr("yyyy-MM-dd HH:mm:ss", dateParamCreatedAt); }    
    
    public String getUpdatedAt() { return this.m_strUpdatedAt; }
    public void setUpdatedAt(String strParamUpdatedAt) { this.m_strUpdatedAt = strParamUpdatedAt; }
    public void setUpdatedAt(Date dateParamUpdatedAt) { this.m_strUpdatedAt = DateUtil.dateToStr("yyyy-MM-dd HH:mm:ss", dateParamUpdatedAt); }    
    
    
    public abstract ArrayList<Object> toArrayForInsert();
    public abstract ArrayList<Object> toArrayForUpdate();
    
    
    public Object getValueFrom(ResultSet rs, String fieldName, Object defaultVal) {
        Object value = defaultVal;
        
        String clsName = defaultVal.getClass().getSimpleName();
        
        try {            
            if(clsName.compareTo("String") == 0) {
                value = rs.getString(fieldName);
            }
            else if(clsName.compareTo("Integer") == 0) {
                value = rs.getInt(fieldName);
            }
            else if(clsName.compareTo("Short") == 0) {
                value = rs.getShort(fieldName);
            }
            else if(clsName.compareTo("Long") == 0) {
                value = rs.getLong(fieldName);
            }
            else if(clsName.compareTo("Double") == 0) {
                value = rs.getDouble(fieldName);
            }
            else if(clsName.compareTo("Float") == 0) {
                value = rs.getFloat(fieldName);
            }
            else if(clsName.compareTo("Boolean") == 0) {
                value = rs.getBoolean(fieldName);
            }
            else if(clsName.compareTo("Byte") == 0) {
                value = rs.getByte(fieldName);
            }
            else if(clsName.compareTo("Date") == 0) {
                value = rs.getDate(fieldName);
            }
            else if(clsName.compareTo("BigDecimal") == 0) {
                value = rs.getBigDecimal(fieldName);
            }
            else if(clsName.compareTo("Timestamp") == 0) {
                value = rs.getTimestamp(fieldName);
            }
            else if(clsName.compareTo("Time") == 0) {
                value = rs.getTime(fieldName);
            }
            else if(clsName.compareTo("Blob") == 0) {
                value = rs.getBlob(fieldName);
            }
            else if(clsName.compareTo("Clob") == 0) {
                value = rs.getClob(fieldName);
            }
        }
        catch(SQLException se) {
            System.out.println(se.toString());
        }
        
        return value;
    }
}
