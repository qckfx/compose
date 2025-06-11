import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import TipTapEditor from "@/components/TipTapEditor";

export default function DocView() {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = useState("Loading…");
  const wsRef = useRef<WebSocket | null>(null);

  // ❶ fetch persisted content once
  useEffect(() => {
    fetch(`/api/doc/${id}`)
      .then((r) => r.json())
      .then((d) => setContent(d.content ?? ""));
  }, [id]);

  // ❷ open websocket for live updates
  useEffect(() => {
    const ws = new WebSocket(`ws://${location.host}/api/ws/${id}`);
    wsRef.current = ws;

    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.type === "draft") {
        setContent(msg.content);
      }
      /* later: status, patches, comments, etc. */
    };
    return () => ws.close();
  }, [id]);

  return (
    <div className="p-8 max-w-2xl mx-auto flex flex-col gap-4 w-full h-full">
      <TipTapEditor docId={id!} initialContent={content} />
    </div>
  );
}
