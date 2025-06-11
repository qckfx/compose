import { v4 as uuid } from 'uuid';

// Later: import { Container } from 'e2b'
async function main() {
  const job = JSON.parse(process.argv[2] ?? '{}');
  console.log(JSON.stringify({ type: 'status', phase: 'starting', jobId: uuid() }));
  // TODO: clone repo & run agent
  console.log(JSON.stringify({ type: 'done' }));
}
main();

