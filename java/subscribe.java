import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class App {

    private final String url = "jdbc:postgresql://MATERIALIZE_HOST:6875/materialize?ssl_mode=require";
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
            State state = new State<Map<String, Integer>>(false);

            while (true) {
                ResultSet rs = stmt.executeQuery("FETCH ALL c");
                boolean updated = false;
                while (rs.next()) {
                    // Map row fields
                    long ts = rs.getLong("mz_timestamp");
                    boolean progress = rs.getBoolean("mz_progressed");
                    int diff = rs.getInt("mz_diff");

                    Map<String, Integer> rowData = new HashMap<>();
                    rowData.put("sum", rs.getInt("sum"));

                    //  When a progress is detected, get the last values
                    if (progress) {
                        if (updated) {
                            updated = false;
                            System.out.println(state.getValues());
                        }
                    } else {
                        // Update the state with the last data
                        updated = true;
                        try {
                            state.update(new Update<Map<String, Integer>>(null, rowData, diff), ts);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
        } catch (SQLException ex) {
            System.out.println(ex.getMessage());
        }
    }

    public static void main(String[] args) {
        App app = new App();
        app.subscribe();
    }
}

/*
 * State class to handle updates from a subscription.
 */
class Update<T> {
  private final Optional<String> key;
  private final T value;
  private final int diff;

  public Update(T value, int diff) {
      this.key = Optional.empty();
      this.value = value;
      this.diff = diff;
  }

  public Update(String key, T value, int diff) {
      this.key = Optional.ofNullable(key);
      this.value = value;
      this.diff = diff;
  }

  public Optional<String> getKey() {
      return key;
  }

  public T getValue() {
      return value;
  }

  public int getDiff() {
      return diff;
  }
}

class State<T> {

    private Map<String, T> state;
    private Map<String, Integer> stateCount;
    private long timestamp;
    private boolean valid;
    private List<Update<T>> history;

    public State(boolean collectHistory) {
        this.state = new HashMap<>();
        this.stateCount = new HashMap<>();
        this.timestamp = 0;
        this.valid = true;
        if (collectHistory) {
            this.history = new ArrayList<>();
        }
    }

    public Object get(String key) {
        return this.state.get(key);
    }

    public List<String> getKeys() {
        return new ArrayList<>(this.state.keySet());
    }

    public List<T> getValues() {
        return new ArrayList<T>(this.state.values());
    }

    public boolean isValid() {
        return this.valid;
    }

    public long getTimestamp() {
        return this.timestamp;
    }

    public Map<String, T> getState() {
        return this.state;
    }

    public List<Update<T>> getHistory() {
        return this.history;
    }

    private void applyDiff(String key, int diff) {
        // Count value starts as a null
        if (!this.stateCount.containsKey(key)) {
            this.stateCount.put(key, diff);
        } else {
            this.stateCount.put(key, this.stateCount.get(key) + diff);
        }
    }

    private String hash(T value) {
        return value.toString(); // You can use any other hash function
    }

    private void validate(long timestamp) {
        if (!this.valid) {
            throw new IllegalStateException("Invalid state.");
        } else if (timestamp < this.timestamp) {
            System.err.println("Invalid timestamp.");
            this.valid = false;
            throw new IllegalStateException(
                    "Update with timestamp (" + timestamp + ") is lower than the last timestamp (" +
                            this.timestamp + "). Invalid state.");
        }
    }

    private void process(Update<T> update) {
        String key = "";
        if (update.getKey().isPresent()) {
          key = update.getKey().get();
        } else {
          key = this.hash(update.getValue());
        }
        this.applyDiff(key, update.getDiff());
        int count = this.stateCount.get(key);

        if (history != null) {
            this.history.add(update);
        }

        if (count <= 0) {
            this.state.remove(key);
            this.stateCount.remove(key);
        } else {
            this.state.put(key, update.getValue());
        }
    }

    public void update(Update<T> update, long timestamp) {
        this.validate(timestamp);
        this.timestamp = timestamp;
        this.process(update);
    }

    public void batchUpdate(List<Update<T>> updates, long timestamp) {
        if (updates != null && !updates.isEmpty()) {
            this.validate(timestamp);
            this.timestamp = timestamp;
            updates.forEach(this::process);
        }
    }

    @Override
    public String toString() {
        return state.toString();
    }
}
