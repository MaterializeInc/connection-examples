import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class Connection {

    private final String url = "jdbc:postgresql://MATERIALIZE_HOST:6875/materialize?sslmode=require";
    private final String user = "MATERIALIZE_USERNAME";
    private final String password = "MATERIALIZE_PASSWORD";

    /**
     * Connect to Materialize
     *
     * @return a Connection object
     */
    public java.sql.Connection connect() {
        Properties props = new Properties();
        props.setProperty("user", user);
        props.setProperty("password", password);
        java.sql.Connection conn = null;
        try {
            conn = DriverManager.getConnection(url, props);
            System.out.println("Connected to Materialize successfully!");
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }

        return conn;
    }

    public static void main(String[] args) {
        Connection app = new Connection();
        app.connect();
    }
}