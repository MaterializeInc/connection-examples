class Update
    attr_accessor :key, :value, :diff

    def initialize(key: nil, value:, diff:)
      @key = key
      @value = value
      @diff = diff
    end
  end

  class State
    def initialize(collect_history = false)
      @state = {}
      @state_count = {}
      @timestamp = 0
      @valid = true
      @history = collect_history ? [] : nil
    end

    def get(key)
      @state[key]
    end

    def get_keys
      @state.keys
    end

    def get_values
      @state.values
    end

    def is_valid?
      @valid
    end

    def get_timestamp
      @timestamp
    end

    def get_state
      Marshal.load(Marshal.dump(@state))
    end

    def get_history
      @history
    end

    def update(update, timestamp)
      validate(timestamp)
      @timestamp = timestamp
      process(update)
    end

    def batch_update(updates, timestamp)
      return unless updates&.any?

      validate(timestamp)
      @timestamp = timestamp
      updates.each { |update| process(update) }
    end

    def to_s
      @state.to_json
    end

    private

    def apply_diff(key, diff)
      @state_count[key] = @state_count[key].to_i + diff
    end

    def hash(value)
      JSON.generate(value)
    end

    def validate(timestamp)
      raise "Invalid state." unless @valid

      if timestamp < @timestamp
        puts "Invalid timestamp."
        @valid = false
        raise "Update with timestamp (#{timestamp}) is lower than the last timestamp (#{@timestamp}). Invalid state."
      end
    end

    def process(update)
      key = update[:key] || hash(update[:value])
      apply_diff(key, update[:diff])
      count = @state_count[key]

      @history&.push(update)

      if count <= 0
        @state.delete(key)
        @state_count.delete(key)
      else
        @state[key] = update[:value]
      end
    end
  end
