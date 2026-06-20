class InMemoryStore {
  constructor() {
    this.store = {};
    this.timers = {};
  }
  async set(key, value, options = {}) {
    this.store[key] = value;
    if (options.EX) {
      if (this.timers[key]) clearTimeout(this.timers[key]);
      this.timers[key] = setTimeout(() => {
        delete this.store[key];
        delete this.timers[key];
      }, options.EX * 1000);
    }
  }
  async get(key) {
    return this.store[key] || null;
  }
  async del(key) {
    delete this.store[key];
    if (this.timers[key]) clearTimeout(this.timers[key]);
  }
}
module.exports = InMemoryStore;
