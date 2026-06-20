const InMemoryStore = require('./inMemoryStore');
let client;
if (process.env.NODE_ENV === 'development' && !process.env.REDIS_URL) {
  // Development mode without Redis: use in-memory store directly
  client = new InMemoryStore();
} else {
  try {
    const { createClient } = require('redis');
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    client = createClient({ url: redisUrl });
    client.on('error', (err) => {
      console.error('[REDIS] Connection error:', err);
      client = new InMemoryStore();
    });
    client.connect().catch((err) => {
      console.error('[REDIS] Failed to connect:', err);
      client = new InMemoryStore();
    });
  } catch (e) {
    console.error('[REDIS] redis package not found, using in-memory store:', e);
    client = new InMemoryStore();
  }
}
module.exports = client;
