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
import { useAutosave } from "@/hooks/useAutosave";
import SaveIndicator from "../SaveIndicator";
import "./tiptap-editor.css";

export default function TipTapEditor({
  docId,
  initialContent,
  initialUpdatedAt,
  onContentChange,
  onUserContentChange,
  heading,
}: {
  docId: string;
  initialContent: string;
  initialUpdatedAt?: string | null;
  onContentChange?: (newContent: string) => void;
  onUserContentChange?: (newContent: string) => void;
  heading?: string;
}) {
  const wsRef = useRef<WebSocket | null>(null);
  const commentsEnabled = useFeatureFlagEnabled("comments");

  // Initialize autosave hook
  const autosave = useAutosave({ docId, initialUpdatedAt });

  const editor = useEditor({
    extensions: [StarterKit, CommentMark, Markdown],
    content: initialContent,
    editable: true,
    autofocus: false,
    onUpdate: ({ editor }) => {
      const content =
        (editor.storage.markdown?.getMarkdown?.() as string) ??
        editor.getHTML();
      onUserContentChange?.(content);
      autosave.triggerSave(content);
    },
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
    editor.commands.focus(0, { scrollIntoView: false });
  }, [docId, editor, commentsEnabled]);

  useEffect(() => {
    const protocol = location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${location.host}/api/ws/${docId}`);
    wsRef.current = ws;

    ws.onmessage = async (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.type === "draft") {
        editor?.commands.setContent(msg.content, false);
        // Notify parent that new content has arrived so it can hide loaders, etc.
        onContentChange?.(msg.content);
        // Re-apply comment highlights that may have been lost
        await applyCommentMarks();
      } else if (msg.type === "user-save") {
        // Handle content updates from other tabs/clients
        const currentContent =
          (editor?.storage.markdown?.getMarkdown?.() as string) ??
          editor?.getHTML() ??
          "";

        // Only update if the incoming content is different from current content
        if (msg.content !== currentContent) {
          editor?.commands.setContent(msg.content);
          onContentChange?.(msg.content);
          await applyCommentMarks();
        }
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
      editor.commands.setContent(initialContent, false);
    }
    applyCommentMarks();
  }, [initialContent, editor, applyCommentMarks]);

  // Ensure proper initial scroll position on mobile
  useEffect(() => {
    if (window.innerWidth <= 640 && editor) {
      // Reset scroll positions immediately
      window.scrollTo(0, 0);
      const editorContainer = document.querySelector(
        ".tiptap-editor-container",
      );
      if (editorContainer) {
        editorContainer.scrollTop = 0;
      }
    }
  }, [editor, initialContent]);

  // Redirect all page scroll events to the editor
  useEffect(() => {
    const editorContainer = document.querySelector(".tiptap-editor-container");
    if (!editorContainer) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      editorContainer.scrollTop += e.deltaY;
    };

    document.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className="flex ml-auto w-full h-full">
      <div className="flex-1 pr-1 sm:pr-4 w-full">
        {editor && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4">
            <div className="flex items-center gap-3">
              {/* Back button */}
              <Link
                to="/new"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 flex-shrink-0"
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
                <h2 className="text-sm sm:text-base font-semibold text-[#1B9847] truncate">
                  {heading}
                </h2>
              )}
            </div>
            <div className="flex-shrink-0">
              <ExportDropdown editor={editor} />
            </div>
          </div>
        )}
        <div className="bg-white border border-gray-200 shadow-md rounded-t-xl w-full mx-auto mb-0">
          <div className="p-4 sm:p-6 lg:p-8 pb-0">
            <div className="h-[calc(100vh-200px-var(--safe-top)-var(--safe-bottom))] sm:h-[calc(100vh-140px)] lg:h-[calc(100vh-120px)] overflow-y-auto tiptap-editor-container">
              <EditorContent
                editor={editor}
                className="prose prose-sm sm:prose-base lg:prose-lg prose-neutral text-gray-900 leading-relaxed focus:outline-none pb-8 max-w-none break-words"
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
      <SaveIndicator
        state={autosave.state}
        lastSaved={autosave.lastSaved}
        error={autosave.error}
      />
    </div>
  );
}
