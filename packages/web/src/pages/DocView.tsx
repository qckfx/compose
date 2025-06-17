import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TipTapEditor from "@/components/editor/TipTapEditor";
import LoadingSpinner from "@/components/LoadingSpinner";

const DOC_LOADING_STATES = [
  "Cloning repository...",
  "Reading files...",
  "Thinking...",
  "Drafting v1...",
];

export default function DocView() {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = useState<string>("");
  const navigate = useNavigate();

  // ❶ fetch persisted content once
  useEffect(() => {
    let cancelled = false;

    fetch(`/api/doc/${id}`)
      .then(async (r) => {
        if (r.status === 404) {
          navigate("/not-found", { replace: true });
          throw new Error("not-found");
        }
        return r.json();
      })
      .then((d) => {
        if (!cancelled) {
          setContent(d.content ?? "");
        }
      })
      .catch((err) => {
        // Swallow navigation-triggered error or display generic message
        console.error(err);
        if (err.message !== "not-found" && !cancelled) {
          setContent("Failed to load document");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  return (
    <>
      <style>{`
        html, body {
          overflow: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        html::-webkit-scrollbar, body::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="doc-view-page p-2 sm:p-6 lg:p-8 w-full sm:max-w-4xl mx-auto h-screen flex flex-col gap-4 sm:gap-6 relative overflow-hidden overscroll-none">
        {/* Editor container fills remaining space */}
        <div className="flex-1 min-h-0 flex flex-col">
          <TipTapEditor
            docId={id!}
            initialContent={content}
            onContentChange={setContent}
            heading="Editing draft"
          />
        </div>
        {!content && (
          <LoadingSpinner
            states={DOC_LOADING_STATES}
            cycleTime={4500 * 8}
            overlay
          />
        )}
      </div>
    </>
  );
}
