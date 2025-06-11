import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CommentMark } from "@/editor/commentMark";
import { useCallback, useEffect, useRef } from "react";
import FloatingCommentToolbar from "./FloatingCommentToolbar";
import SidebarThreads from "./SidebarThreads";
import { Markdown } from "tiptap-markdown";

export default function TipTapEditor({
  docId,
  initialContent,
}: {
  docId: string;
  initialContent: string;
}) {
  const wsRef = useRef<WebSocket | null>(null);

  const editor = useEditor({
    extensions: [StarterKit, CommentMark, Markdown],
    content: initialContent,
    editable: true,
  });

  /** helper to (re)apply unresolved comment highlights */
  const applyCommentMarks = useCallback(async () => {
    if (!editor) return;
    const list: {
      start: number;
      end: number;
      id: string;
      resolved?: boolean;
    }[] = await (await fetch(`/api/doc/${docId}/comments`)).json();

    // Insert marks from back-to-front so indices stay stable
    list
      .slice()
      .sort((a, b) => b.start - a.start)
      .forEach((c) => {
        if (!c.resolved) {
          editor
            .chain()
            .setTextSelection({ from: c.start, to: c.end })
            .setMark("comment", { id: c.id })
            .run();
        }
      });

    editor.commands.setTextSelection(0);
  }, [docId, editor]);

  useEffect(() => {
    const ws = new WebSocket(`ws://${location.host}/api/ws/${docId}`);
    wsRef.current = ws;

    ws.onmessage = async (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.type === "draft") {
        editor?.commands.setContent(msg.content);
        // Re-apply comment highlights that may have been lost
        await applyCommentMarks();
      }
      /* later: status, patches, comments, etc. */
    };
    return () => ws.close();
  }, [docId, editor, applyCommentMarks]);

  useEffect(() => {
    if (!editor) return;
    // Avoid overwriting when the websocket has already pushed a newer draft.
    // Only update if the incoming prop differs from the current editor state.
    const currentMarkdown =
      (editor.storage.markdown?.getMarkdown?.() as string) ?? editor.getHTML();
    if (initialContent !== currentMarkdown) {
      editor.commands.setContent(initialContent);
    }
    applyCommentMarks();
  }, [initialContent, editor, applyCommentMarks]);

  return (
    <div className="flex ml-auto">
      <div className="flex-1 pr-4 max-w-screen-lg">
        <EditorContent editor={editor} className="p-4 prose max-w-none" />
        {editor && <FloatingCommentToolbar editor={editor} docId={docId} />}
      </div>
      {editor && <SidebarThreads docId={docId} editor={editor} />}
    </div>
  );
}
