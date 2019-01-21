/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package give.base.controller;

import give.Give;
import static give.Give.RESOURCE_PATH;
import give.core.controller.GiveController;
import give.core.db.GiveDBHelper;
import java.awt.AWTException;
import java.awt.Image;
import java.awt.SystemTray;
import java.awt.Toolkit;
import java.awt.TrayIcon;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

import java.io.IOException;
import java.net.URL;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Optional;
import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Alert.AlertType;
import javafx.scene.control.ButtonType;
import javafx.stage.Stage;
import javafx.stage.StageStyle;
import javafx.stage.Window;

/**
 *
 * @author Administrator
 */
public class BaseController {

    GiveDBHelper m_dbHelper = null;
    Parent mainPane;
    double yOffset, xOffset;
    public static Connection con;
    public static Statement stmt;
    public static ResultSet rset;


    public BaseController() {
        this.m_dbHelper = Give.G_DBHelper;

        
            try {
                try {
                    Class.forName("com.mysql.jdbc.Driver");
                } catch (ClassNotFoundException ex) {
                    // use the exception here
                    System.out.println("Not Found MySQL driver");
                }

                con = DriverManager.getConnection("jdbc:mysql://localhost/justgiv", "root", "");
                //con = DriverManager.getConnection("jdbc:mysql://192.168.0.204/justgiv", "rentme", "rentme");
                System.out.println("Connected!");
                stmt = con.createStatement();
                
            } catch (SQLException ex) {
            }    
    }

    public void onLinkLogoutPressed(ActionEvent event) throws IOException {
        if (this.showConfirm("Would you like to logout now?")) {
            Give.LOGIN_USER = null;

            FXMLLoader loader = new FXMLLoader();
            loader.setLocation(BaseController.getResourceURL("view/fxml_login.fxml"));
            Scene homeScene = new Scene(loader.load());
            Stage stage = new Stage();
            stage.setScene(homeScene);
            stage.initStyle(StageStyle.UNDECORATED);
            ((Node) (event.getSource())).getScene().getWindow().hide();
            // Get stage and transfer to home scene
            stage.show();
        }
    }

    public static String getAppPath() {
        return System.getProperty("user.dir") + "/";
    }

    /**
     *
     * @param resFile
     * @return
     */
    public static URL getResourceURL(String resFile) {
        URL newURL = null;
        try {
            newURL = new URL(RESOURCE_PATH + resFile);
        } catch (Exception e) {

        }

        return newURL;
    }

    public static Stage getWindowBy(ActionEvent event, boolean bEnableResize) {
        Stage window = (Stage) ((Node) event.getSource()).getScene().getWindow();
        window.resizableProperty().setValue(bEnableResize);

        return window;
    }

    public void showWindow(ActionEvent event, Scene scene) {
        // Get stage and transfer to home scene
        Stage window = BaseController.getWindowBy(event, false);
        window.setScene(scene);
        window.show();
    }

    public boolean showAlert(String strParamMessage) {
        Alert alert = new Alert(AlertType.WARNING, strParamMessage);
        Optional<ButtonType> result = alert.showAndWait();

        return (result.isPresent() && result.get() == ButtonType.OK);
    }

    public boolean showPrompt(String strParamMessage) {
        Alert alert = new Alert(AlertType.INFORMATION, strParamMessage);
        Optional<ButtonType> result = alert.showAndWait();

        return (result.isPresent() && result.get() == ButtonType.OK);
    }

    public boolean showConfirm(String strParamMessage) {
        Alert alert = new Alert(AlertType.CONFIRMATION, strParamMessage);
        Optional<ButtonType> result = alert.showAndWait();

        return (result.isPresent() && result.get() == ButtonType.OK);
    }

    //-----------------------------------------------------------------------------------
    public void closeButtonPressed() {

        Platform.exit();

    }

    public void minimizeButtonPressed(ActionEvent e) {

        Node source = (Node) e.getSource();
        javafx.stage.Window theStage = source.getScene().getWindow();
        Stage stage = (Stage) theStage;
        stage.setIconified(true);

    }

    public void accountButtonPressed(ActionEvent event) throws IOException {
        Parent accountParent = FXMLLoader.load(BaseController.getResourceURL("view/fxml_account.fxml"));
        Scene accountScene = new Scene(accountParent);

        // Get stage and transfer to give scene
        this.showWindow(event, accountScene);
    }

    public void charityButtonPressed(ActionEvent event) throws IOException {
        Parent accountParent = FXMLLoader.load(BaseController.getResourceURL("view/fxml_home.fxml"));
        Scene accountScene = new Scene(accountParent);

        // Get stage and transfer to give scene
        this.showWindow(event, accountScene);
    }

    public void giveButtonPressed(ActionEvent event) throws IOException {
        FXMLLoader loader = new FXMLLoader(getResourceURL("view/fxml_give.fxml"));

        Parent giveParent = loader.load();
        Scene giveScene = new Scene(giveParent);
        // Get stage and transfer to give scene
        Stage window = BaseController.getWindowBy(event, false);
        window.hide();
        GiveController controller = loader.getController();
        controller.mainStage = window;

        Stage newWindow = new Stage();
        newWindow.setAlwaysOnTop(true);
        newWindow.setScene(giveScene);

        newWindow.show();
        addToSystemTray(window);
    }

    private void addToSystemTray(Stage mainStage) {
        if (!SystemTray.isSupported()) {
            System.err.println("System tray is not supported!");
            return;
        }
        SystemTray tray = SystemTray.getSystemTray();

        Image image = Toolkit.getDefaultToolkit().createImage("tray_icon.png");
        TrayIcon trayIcon = new TrayIcon(image);
        trayIcon.setImageAutoSize(true);
        trayIcon.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                super.mouseClicked(e);
                for (TrayIcon icon : tray.getTrayIcons()) {
                    tray.remove(icon);
                }
                Platform.runLater(mainStage::show);
            }
        });

        try {
            tray.add(trayIcon);
        } catch (AWTException e) {
            System.err.println("Cannot add system tray!");
            e.printStackTrace();
        }
    }

}
