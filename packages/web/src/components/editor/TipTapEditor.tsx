import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CommentMark } from "@/editor/commentMark";
import { useCallback, useEffect, useRef } from "react";
import FloatingCommentToolbar from "../FloatingCommentToolbar";
import SidebarThreads from "../SidebarThreads";
import { Markdown } from "tiptap-markdown";
import { useFeatureFlagEnabled } from "posthog-js/react";
import ExportDropdown from "./ExportDropdown";
import { Link } from "react-router-dom";
import "./tiptap-editor.css";

export default function TipTapEditor({
  docId,
  initialContent,
  onContentChange,
  heading,
}: {
  docId: string;
  initialContent: string;
  onContentChange?: (newContent: string) => void;
  heading?: string;
}) {
  const wsRef = useRef<WebSocket | null>(null);
  const commentsEnabled = useFeatureFlagEnabled("comments");

  const editor = useEditor({
    extensions: [StarterKit, CommentMark, Markdown],
    content: initialContent,
    editable: true,
  });

  /** helper to (re)apply unresolved comment highlights */
  const applyCommentMarks = useCallback(async () => {
    if (!editor || !commentsEnabled) return;
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
  }, [docId, editor, commentsEnabled]);

  useEffect(() => {
    const protocol = location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${location.host}/api/ws/${docId}`);
    wsRef.current = ws;

    ws.onmessage = async (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.type === "draft") {
        editor?.commands.setContent(msg.content);
        // Notify parent that new content has arrived so it can hide loaders, etc.
        onContentChange?.(msg.content);
        // Re-apply comment highlights that may have been lost
        await applyCommentMarks();
      }
      /* later: status, patches, comments, etc. */
    };
    return () => ws.close();
  }, [docId, editor, applyCommentMarks, onContentChange]);

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
        {editor && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Back button */}
              <Link
                to="/new"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                title="Back to drafts"
              >
                {/* Simple arrow icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </Link>

              {heading && (
                <h2 className="text-base font-semibold text-[#1B9847]">
                  {heading}
                </h2>
              )}
            </div>
            <ExportDropdown editor={editor} />
          </div>
        )}
        <div className="bg-white border border-gray-200 shadow-md rounded-t-xl max-w-3xl mx-auto mb-0">
          <div className="p-8 pb-0">
            <div className="h-[calc(100vh-4rem+12px)] overflow-y-auto tiptap-editor-container">
              <EditorContent
                editor={editor}
                className="prose prose-lg prose-neutral text-gray-900 leading-relaxed focus:outline-none pb-4"
              />
            </div>
          </div>
        </div>
        {editor && commentsEnabled && (
          <FloatingCommentToolbar editor={editor} docId={docId} />
        )}
      </div>
      {editor && commentsEnabled && (
        <SidebarThreads docId={docId} editor={editor} />
      )}
    </div>
  );
}
