export interface Update<T> {
    key?: string;
    value: T;
    diff: number;
}

class State<T> {
    private state: Record<string, any>;
    private stateCount: Record<string, number>;
    private timestamp: number;
    private valid: boolean;
    private history: Array<Update<T>> | undefined;

    constructor(collectHistory?: boolean) {
      this.state = {};
      this.stateCount = {};
      this.timestamp = 0;
      this.valid = true;
      if (collectHistory) {
        this.history = [];
      }
    }

    get(key: string) {
      return this.state[key];
    }

    getKeys(): Array<string> {
      return Object.keys(this.state);
    }

    getValues(): Array<T> {
      return Object.values(this.state);
    }

    isValid(): Boolean {
      return this.valid;
    }

    getTimestamp(): Number {
      return this.timestamp;
    }

    getState(): Readonly<Record<string, T>> {
      return structuredClone(this.state);
    }

    getHistory(): Array<Update<T>> | undefined {
      return this.history;
    }

    private apply_diff(key: string, diff: number) {
      // Count value starts as a NaN
      if (this.stateCount[key] === undefined) {
        this.stateCount[key] = diff;
      } else {
        this.stateCount[key] = this.stateCount[key] + diff
      }
    }

    private hash(value: T): string {
      return JSON.stringify(value);
    }

    private validate(timestamp: number) {
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

    private process({ key, value, diff }: Update<T>) {
      const _key = key || this.hash(value);
      this.apply_diff(_key, diff);
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

    update(update: Update<T>, timestamp: number) {
      this.validate(timestamp);
      this.timestamp = timestamp;
      this.process(update);
    }

    batchUpdate(updates: Array<Update<T>>, timestamp: number) {
      if (Array.isArray(updates) && updates.length > 0) {
        this.validate(timestamp);
        this.timestamp = timestamp;
        updates.forEach(this.process.bind(this));
      }
    }

    toString() {
      return JSON.stringify(this.state);
    }
};

export { State }