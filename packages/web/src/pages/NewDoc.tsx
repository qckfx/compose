import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NewDoc() {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  async function handleStart() {
    const res = await fetch("/api/start-draft", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        repoUrl: "https://github.com/qckfx/agent-sdk",
        prompt,
      }),
    });
    const { sessionId } = await res.json();
    navigate(`/doc/${sessionId}`);
  }

  return (
    <div className="p-8 max-w-2xl mx-auto flex flex-col gap-4 w-full h-full">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the feature..."
        className="p-2 w-full border rounded h-32"
      />
      <Button onClick={handleStart}>Generate Draft</Button>
    </div>
  );
}
