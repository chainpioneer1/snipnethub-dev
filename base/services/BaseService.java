/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package give.base.services;

import give.Give;
import give.core.db.GiveDBHelper;

/**
 *
 * @author Administrator
 */
public class BaseService {
    protected GiveDBHelper m_dbHelper;
    
    public BaseService() { this.m_dbHelper = Give.G_DBHelper; }
    
}
