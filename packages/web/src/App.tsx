import { useEffect, useState } from 'react';

export default function App() {
  const [pong, setPong] = useState<string>('…');

  useEffect(() => {
    fetch('/api/ping')
      .then(r => r.json())
      .then(d => setPong(JSON.stringify(d, null, 2)));
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Design‑Doc Buddy</h1>
      <pre className="bg-gray-100 p-4 rounded">{pong}</pre>
    </main>
  );
}

