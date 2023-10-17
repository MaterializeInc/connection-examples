import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.*;
import java.sql.ResultSet;
import java.sql.Statement;

public class Subscribe {

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

    public void subscribe() {
        try (Connection conn = connect()) {

            Statement stmt = conn.createStatement();
            stmt.execute("BEGIN");
            stmt.execute("DECLARE c CURSOR FOR SUBSCRIBE (SELECT sum FROM counter_sum) WITH (PROGRESS);");
            State<HashMap<String, BigDecimal>> state = new State<>(false);
            List<Update<HashMap<String, BigDecimal>>> buffer = new ArrayList<>();

            while (true) {
                ResultSet rs = stmt.executeQuery("FETCH ALL c");
                boolean updated = false;
                while (rs.next()) {
                    // Map row fields
                    long ts = rs.getLong("mz_timestamp");
                    boolean progress = rs.getBoolean("mz_progressed");
                    int diff = rs.getInt("mz_diff");

                    HashMap<String, BigDecimal> rowData = new HashMap<>();
                    rowData.put("sum", rs.getBigDecimal("sum"));

                    //  When a progress is detected, get the last values
                    if (progress) {
                        if (updated) {
                            updated = false;

                            // Update the state with the last data
                            state.update(buffer, ts);
                            buffer.clear();

                            System.out.println(state.getState());
                        }
                    } else {
                        updated = true;
                        buffer.add(new Update<>(rowData, diff));
                    }
                }
            }
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
        }
    }

    public static void main(String[] args) {
        Subscribe app = new Subscribe();
        app.subscribe();
    }
}

/*
 * State class to handle updates from a subscription.
 */
record Update<T>(T value, int diff) {};

class State<T> {
  private final HashMap<T, Integer> state;
  private long timestamp;
  private boolean valid;
  private List<Update<T>> history;

  public State(boolean collectHistory) {
    state = new HashMap<>();
    timestamp = 0;
    valid = true;
    if (collectHistory) {
      history = new ArrayList<>();
    }
  }

  public List<T> getState() {
    List<T> list = new ArrayList<>();

    for (Map.Entry<T, Integer> entry : state.entrySet()) {
      T value = entry.getKey();
      int count = entry.getValue();

      for (int i = 0; i < count; i++) {
        list.add(value);
      }
    }

    return list;
  }

  public List<Update<T>> getHistory() {
    return history;
  }

  private void validate(long timestamp) {
    if (!valid) {
      throw new RuntimeException("Invalid state.");
    } else if (timestamp < this.timestamp) {
      System.err.println("Invalid timestamp.");
      valid = false;
      throw new RuntimeException(String.format(
        "Update with timestamp (%d) is lower than the last timestamp (%d). Invalid state.", timestamp, this.timestamp));
    }
  }

  private void process(Update<T> update) {
    T value = update.value();
    int diff = update.diff();

    int count = state.containsKey(value) ? state.get(value) + diff : diff;

    if (count <= 0) {
      state.remove(value);
    } else {
      state.put(value, count);
    }

    if (history != null) {
      history.add(update);
    }
  }

  public void update(List<Update<T>> updates, long timestamp) {
    if (!updates.isEmpty()) {
      validate(timestamp);
      this.timestamp = timestamp;
      updates.forEach(this::process);
    }
  }
}

