class State {
    constructor(collectHistory) {
      this.state = {};
      this.stateCount = {};
      this.timestamp = 0;
      this.valid = true;
      if (collectHistory) {
        this.history = [];
      }
    }

    get(key) {
      return this.state[key];
    }

    getKeys() {
      return Object.keys(this.state);
    }

    getValues() {
      return Object.values(this.state);
    }

    isValid() {
      return this.valid;
    }

    getTimestamp() {
      return this.timestamp;
    }

    getState() {
      return structuredClone(this.state);
    }

    getHistory() {
      return this.history;
    }

    #apply_diff(key, diff) {
      // Count value starts as a NaN
      if (this.stateCount[key] === undefined) {
        this.stateCount[key] = diff;
      } else {
        this.stateCount[key] = this.stateCount[key] + diff
      }
    }

    #hash(value) {
      return JSON.stringify(value);
    }

    #validate(timestamp) {
      if (!this.valid) {
        throw new Error("Invalid state.");
      } else if (timestamp < this.timestamp) {
        console.error("Invalid timestamp.");
        this.valid = false;
        throw new Error(
          `Update with timestamp (${timestamp}) is lower than the last timestamp (${
            this.timestamp
          }). Invalid state.`
        );
      }
    }

    #process({ key, value, diff }) {
      const _key = key || this.#hash(value);
      this.#apply_diff(_key, diff);
      const count = this.stateCount[_key];

      if (this.history) {
        this.history.push({ key: _key, value, diff });
      }

      if (count <= 0) {
        delete this.state[_key];
        delete this.stateCount[_key];
      } else {
        this.state[_key] = value;
      }
    }

    update(update, timestamp) {
      this.#validate(timestamp);
      this.timestamp = timestamp;
      this.#process(update);
    }

    batchUpdate(updates, timestamp) {
      if (Array.isArray(updates) && updates.length > 0) {
        this.#validate(timestamp);
        this.timestamp = timestamp;
        updates.forEach(this.#process.bind(this));
      }
    }

    toString() {
      return JSON.stringify(this.state);
    }
};

module.exports = State;