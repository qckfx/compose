import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TipTapEditor from "@/components/editor/TipTapEditor";
import LoadingSpinner from "@/components/LoadingSpinner";
import { offlineStorage } from "@/utils/offlineStorage";

const DOC_LOADING_STATES = [
  "Cloning repository...",
  "Reading files...",
  "Thinking...",
  "Drafting v1...",
];

export default function DocView() {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = useState<string>("");
  const [localUpdatedAt, setLocalUpdatedAt] = useState<string | null>(null);
  const [hasConflict, setHasConflict] = useState(false);
  const [serverContent, setServerContent] = useState<string | null>(null);
  const [serverUpdatedAt, setServerUpdatedAt] = useState<string | null>(null);
  const navigate = useNavigate();

  // ❶ Check for offline saves and fetch server content
  useEffect(() => {
    let cancelled = false;

    const loadDocument = async () => {
      if (!id) return;

      try {
        // First check for offline saves
        const saves = await offlineStorage.getAllOfflineSaves();
        const offlineSave = saves.find((save) => save.docId === id);

        // Then fetch server content
        const response = await fetch(`/api/doc/${id}`);
        if (response.status === 404) {
          navigate("/not-found", { replace: true });
          return;
        }
        const serverDoc = await response.json();

        if (cancelled) return;

        // Now decide what to show
        if (offlineSave) {
          // We have offline content
          if (new Date(offlineSave.updatedAt) < new Date(serverDoc.updatedAt)) {
            // Server has newer content - conflict!
            setHasConflict(true);
            setServerContent(serverDoc.content);
            setServerUpdatedAt(serverDoc.updatedAt);
            // Show offline content by default
            setContent(offlineSave.content);
            setLocalUpdatedAt(offlineSave.updatedAt);
          } else {
            // Offline content is newer or same - use it
            setContent(offlineSave.content);
            setLocalUpdatedAt(offlineSave.updatedAt);
          }
        } else {
          // No offline content - use server content
          setContent(serverDoc.content ?? "");
          setLocalUpdatedAt(serverDoc.updatedAt ?? null);
        }
      } catch (err) {
        console.error("Error loading document:", err);
        if (!cancelled) {
          setContent("Failed to load document");
        }
      }
    };

    loadDocument();

    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  const handleUseServerVersion = async () => {
    if (serverContent && serverUpdatedAt) {
      // Clear the offline save
      await offlineStorage.removeSave(id!);
      // Update to server version
      setContent(serverContent);
      setLocalUpdatedAt(serverUpdatedAt);
      setHasConflict(false);
    }
  };

  return (
    <div className="doc-view-page p-2 sm:p-6 lg:p-8 pt-[calc(0.5rem+var(--safe-top))] pb-[var(--safe-bottom)] w-full sm:max-w-4xl mx-auto min-h-screen flex flex-col gap-4 sm:gap-6 relative sm:overflow-hidden overscroll-none">
      {/* Conflict warning banner */}
      {hasConflict && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <p className="font-medium text-orange-900">
                Document was updated elsewhere
              </p>
              <p className="text-sm text-orange-700">
                You have unsaved changes that conflict with the server version.
              </p>
            </div>
          </div>
          <button
            onClick={handleUseServerVersion}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 text-sm font-medium"
          >
            Use server version
          </button>
        </div>
      )}

      {/* Editor container fills remaining space */}
      <div className="flex-1 min-h-0 flex flex-col">
        {localUpdatedAt && (
          <TipTapEditor
            docId={id!}
            initialContent={content}
            initialUpdatedAt={localUpdatedAt}
            onContentChange={setContent}
            heading="Editing draft"
          />
        )}
      </div>
      {(!content || !localUpdatedAt) && (
        <LoadingSpinner
          states={DOC_LOADING_STATES}
          cycleTime={4500 * 8}
          overlay
        />
      )}
    </div>
  );
}
