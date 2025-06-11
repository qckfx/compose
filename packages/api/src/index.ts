import Fastify from 'fastify';
import cors from '@fastify/cors';

const app = Fastify({ logger: true });
await app.register(cors, { origin: true });

app.get('/api/ping', async () => ({ ok: true, ts: Date.now() }));

app.listen({ port: 4000, host: '0.0.0.0' }).then(addr => {
  console.log('API running →', addr);
});

