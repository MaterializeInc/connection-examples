import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.PreparedStatement;

public class Source {

    private final String url = "jdbc:postgresql://MATERIALIZE_HOST:6875/materialize?sslmode=require";
    private final String user = "MATERIALIZE_USERNAME";
    private final String password = "MATERIALIZE_PASSWORD";

    /**
     * Connect to Materialize
     *
     * @return a Connection object
     */
    public Connection connect() throws SQLException {
        Properties props = new Properties();
        props.setProperty("user", user);
        props.setProperty("password", password);

        return DriverManager.getConnection(url, props);

    }

    public void source() {
        String SQL = "CREATE SOURCE IF NOT EXISTS counter"
                   + "FROM LOAD GENERATOR COUNTER"
                   + "(TICK INTERVAL '500ms')"
                   + "WITH (SIZE = '3xsmall');";

        try (Connection conn = connect()) {
            Statement st = conn.createStatement();
            st.execute(SQL);
            System.out.println("Source created.");
            st.close();
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
        }
    }

    public static void main(String[] args) {
        Source app = new Source();
        app.source();
    }
}