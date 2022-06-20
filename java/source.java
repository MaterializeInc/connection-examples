import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.PreparedStatement;

public class App {

    private final String url = "jdbc:postgresql://localhost:6875/materialize";
    private final String user = "materialize";
    private final String password = "materialize";

    /**
     * Connect to Materialize
     *
     * @return a Connection object
     */
    public Connection connect() throws SQLException {
        Properties props = new Properties();
        props.setProperty("user", user);
        props.setProperty("password", password);
        props.setProperty("ssl","false");

        return DriverManager.getConnection(url, props);

    }

    public void source() {

        String SQL = "CREATE SOURCE market_orders_raw_2 FROM PUBNUB "
                   + "SUBSCRIBE KEY 'sub-c-4377ab04-f100-11e3-bffd-02ee2ddab7fe' "
                   + "CHANNEL 'pubnub-market-orders'";

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
        App app = new App();
        app.source();
    }
}