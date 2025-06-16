import { useEffect, useState } from "react";
import classNames from "classnames";
import type { Editor } from "@tiptap/react";
import { Button } from "./ui/button";
// Icons
import { ArrowUpRight, Check } from "lucide-react";

interface Comment {
  id: string;
  body: string;
  resolved: boolean;
  start: number;
  end: number;
  createdAt: string;
}

export default function SidebarThreads({
  docId,
  editor,
}: {
  docId: string;
  editor: Editor;
}) {
  const [comments, setComments] = useState<Comment[]>([]);

  /** fetch once on mount */
  useEffect(() => {
    fetch(`/api/doc/${docId}/comments`)
      .then((r) => r.json())
      .then(setComments);
  }, [docId]);

  /** WS live updates (assumes msg types from earlier scaffold) */
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(
      `${protocol}//${window.location.host}/api/ws/${docId}`,
    );
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.type === "comment_add") {
        setComments((prev) => [...prev, msg.comment]);
      }
      if (msg.type === "comment_resolve") {
        setComments((prev) =>
          prev.map((c) => (c.id === msg.id ? { ...c, resolved: true } : c)),
        );
      }
    };
    return () => ws.close();
  }, [docId]);

  /** Scroll editor to comment range */
  function jump(c: Comment) {
    // Focus the editor, set the selection range, and ensure it scrolls into view
    editor
      ?.chain()
      .focus()
      .setTextSelection({ from: c.start, to: c.end })
      .scrollIntoView()
      .run();
  }

  async function resolve(id: string) {
    await fetch(`/api/comment/${id}/resolve`, { method: "POST" });
    const c = comments.find((c) => c.id === id);
    if (!c) return;
    // optimistic UI (WS will also confirm)
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, resolved: true } : c)),
    );
    // remove mark highlight
    editor
      ?.chain()
      .setTextSelection({ from: c.start, to: c.end })
      .unsetMark("comment")
      .setTextSelection(0)
      .run();
  }

  return (
    <aside className="sticky top-0 flex-none min-w-56 max-h-screen w-full sm:w-1/3 lg:w-1/4 border-l pl-3 overflow-y-auto bg-white">
      <h3 className="font-semibold mb-3">Comments</h3>
      {comments.map((c) => (
        <div
          key={c.id}
          className={classNames(
            "mb-2 p-2 rounded border shadow-sm",
            c.resolved ? "opacity-50 text-gray-500" : "bg-yellow-50",
          )}
        >
          <p className="text-sm whitespace-pre-wrap">{c.body}</p>
          <div className="text-xs flex justify-between mt-1">
            <Button
              onClick={() => jump(c)}
              variant="outline"
              size="sm"
              className="gap-1 border-blue-300 text-blue-600 bg-transparent dark:bg-transparent hover:bg-blue-50/50 dark:hover:bg-blue-600/20"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Jump</span>
            </Button>
            {!c.resolved && (
              <Button
                onClick={() => resolve(c.id)}
                variant="outline"
                size="sm"
                className="gap-1 border-green-300 text-green-600 bg-transparent dark:bg-transparent hover:bg-green-50/40 dark:hover:bg-green-600/20"
              >
                <Check className="w-4 h-4" />
                <span>Resolve</span>
              </Button>
            )}
          </div>
        </div>
      ))}
      {!comments.length && (
        <p className="text-sm text-gray-400">No comments yet.</p>
      )}
    </aside>
  );
}
