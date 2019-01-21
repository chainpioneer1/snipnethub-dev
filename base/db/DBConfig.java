/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package give.base.db;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.util.HashMap;

/**
 *
 * @author cr
 */
public class DBConfig {
    public static final String SETTING_KEY_SERVER   = "server";
    public static final String SETTING_KEY_PORT     = "port";
    public static final String SETTING_KEY_USER     = "username";
    public static final String SETTING_KEY_PWD      = "password";
    public static final String SETTING_KEY_DB       = "database";
    
    private static final String DB_CONFIG_FILE = "config/db.ini";
    
    HashMap m_Settings = new HashMap();
    
    public DBConfig() {        
        this.m_Settings.put(SETTING_KEY_SERVER, "");
        this.m_Settings.put(SETTING_KEY_PORT, "");
        this.m_Settings.put(SETTING_KEY_USER, "");
        this.m_Settings.put(SETTING_KEY_PWD, "");
        this.m_Settings.put(SETTING_KEY_DB, "");
        
        load();        
    }
    
    private void load(){
        try{
            try (InputStream fis = new FileInputStream(System.getProperty("user.dir") + "/" + DB_CONFIG_FILE); 
                    InputStreamReader isr = new InputStreamReader(fis, Charset.forName("UTF-8")); 
                    BufferedReader br = new BufferedReader(isr)) {
                
                String strLine = br.readLine();
                setSettingKey(SETTING_KEY_SERVER, strLine.split("=")[1].trim() );
                
                strLine = br.readLine();
                setSettingKey(SETTING_KEY_PORT, strLine.split("=")[1].trim());
                
                strLine = br.readLine();
                setSettingKey(SETTING_KEY_USER, strLine.split("=")[1].trim());
                
                strLine = br.readLine();
                setSettingKey(SETTING_KEY_PWD, strLine.split("=")[1].trim());
                
                strLine = br.readLine();
                setSettingKey(SETTING_KEY_DB, strLine.split("=")[1].trim());                
            }         
        }       
        catch(IOException e){
//            System.out.println(e.toString());
        }
    }
    
    public String getServer() {
        return (String)this.m_Settings.get(SETTING_KEY_SERVER);
    }
    
    public void setServer(String server) {
        this.m_Settings.replace(SETTING_KEY_SERVER, server);
    }
    
    public String getPort() {
        return (String)this.m_Settings.get(SETTING_KEY_PORT);
    }
    
    public void setPort(String port) {
        this.m_Settings.replace(SETTING_KEY_PORT, port);
    }
    
    public String getUserName() {
        return (String)this.m_Settings.get(SETTING_KEY_USER);
    }
    
    public void setUserName(String user) {
        this.m_Settings.replace(SETTING_KEY_USER, user);
    }
    
    
    public String getPassword() {
        return (String)this.m_Settings.get(SETTING_KEY_PWD);
    }
    
    public void setPassword(String pwd) {
        this.m_Settings.replace(SETTING_KEY_PWD, pwd);
    }
    
    
    public String getDatabase() {
        return (String)this.m_Settings.get(SETTING_KEY_DB);
    }
    
    public void setDatabase(String db) {
        this.m_Settings.replace(SETTING_KEY_DB, db);
    }
    
        
    /**
     * Change the key value of settings
     * 
     * @param key
     * @param value
     */
    private void setSettingKey(String key, String value) {
        this.m_Settings.replace(key, value);
    }
}
