export interface Update<T> {
  value: T;
  diff: number;
}

export default class State<T> {
  private state: Map<T, number>;
  private timestamp: number;
  private valid: boolean;
  private history: Array<Update<T>> | undefined;

  constructor(collectHistory?: boolean) {
    this.state = new Map();
    this.timestamp = 0;
    this.valid = true;
    if (collectHistory) {
      this.history = [];
    }
  }

  getState(): Readonly<Map<T, any>> {
    return structuredClone(this.state);
  }

  getStateAsArray(): Readonly<Array<T>> {
    const list: Array<T> = new Array<T>();

    Array.from(this.state.entries()).forEach(([key, value]) => {
      const clone = structuredClone(key);
      let i = 0;
      while (i< value) {
        list.push(clone);
        i++;
      };
    });

    return list;
  }

  getHistory(): Array<Update<T>> | undefined {
    return this.history;
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

  private process({ value, diff }: Update<T>) {
    // Count value starts as a NaN
    const count = this.state.has(value) ? (this.state.get(value) as number + diff) : diff;

    if (count <= 0) {
      this.state.delete(value);
    } else {
      this.state.set(value, count);
    }


    if (this.history) {
      this.history.push({ value, diff });
    }
  }

  update(update: Update<T>, timestamp: number) {
    this.validate(timestamp);
    this.timestamp = timestamp;
    this.process(update);
  }

  batchUpdate(updates: Array<Update<T>>, timestamp: number) {
    if (updates.length > 0) {
      this.validate(timestamp);
      this.timestamp = timestamp;
      updates.forEach(this.process.bind(this));
    }
  }

  toString() {
    return JSON.stringify(this.state);
  }
};
