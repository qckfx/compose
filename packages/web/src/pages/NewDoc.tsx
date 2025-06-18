import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/clerk-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import classNames from "classnames";
import apiClient from "@/api/apiClient";
import { routes } from "@/api/routes";
import type { Template } from "@/schemas/template";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/*
 * NewDoc page
 * ------------
 * Performance considerations
 * --------------------------
 * This page previously suffered noticeable input lag while typing in the prompt
 * textarea. The root cause was that the textarea value was stored in React
 * state. Every character typed triggered a state update which re-rendered this
 * component – and therefore the entire (potentially large) draft history list
 * below it.  When a user has dozens of drafts the virtual-DOM diff becomes
 * expensive enough to feel sluggish.
 *
 * To address this we made three key changes:
 * 1. The textarea is now **uncontrolled** (managed by a `ref`) so typing no
 *    longer triggers React re-renders.  We read its value only when necessary –
 *    on `submit` and lightweight validation.
 * 2. A simple boolean `hasPrompt` state is kept via `onInput` to know whether
 *    the prompt is non-empty.  This allows us to keep the submit button's
 *    disabled logic and error messaging without storing the full string in
 *    state.
 * 3. The draft list rendering is memoised with `useMemo` (see `renderedDocs`).
 *    Even though typing no longer re-renders the whole component, other small
 *    state changes (e.g. repo select) could still cause unnecessary work.  The
 *    memo ensures we only rebuild the heavy list when the `docs` data actually
 *    changes.
 *
 * Together these tweaks restore a snappy typing experience while preserving the
 * original UX behaviour.
 */

type Repo = { id: string; name: string };
type DocStatus = "drafting" | "completed" | "error";
type Doc = {
  id: string;
  ghRepoName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  status: DocStatus;
  template: Template;
};

export default function NewDoc() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [repositories, setRepositories] = useState<Repo[]>([]);
  const [reposLoading, setReposLoading] = useState(true);
  const [selectedRepo, setSelectedRepo] = useState<Repo | undefined>();
  const [showErrors, setShowErrors] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const [hasPrompt, setHasPrompt] = useState(false);
  const draftHistoryRef = useRef<HTMLDivElement>(null);

  // Fetch repositories on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await routes.fetchRoute("repositories");
        setRepositories(data as Repo[]);
        setReposLoading(false);
      } catch (err) {
        console.error("Error fetching repositories", err);
        setReposLoading(false);
      }
    })();
  }, []);

  // Fetch user's docs on mount
  useEffect(() => {
    (async () => {
      try {
        type DocApi = Omit<Doc, "createdAt" | "updatedAt"> & {
          createdAt: string;
          updatedAt: string;
        };
        const data = await routes.fetchRoute("docs");
        // Convert date strings to Date objects
        const docsWithDates = (data as DocApi[]).map((doc) => ({
          ...doc,
          createdAt: new Date(doc.createdAt),
          updatedAt: new Date(doc.updatedAt),
        }));
        setDocs(docsWithDates);
      } catch (err) {
        console.error("Error fetching user docs", err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const data = await routes.fetchRoute("templates");
      setTemplates(data as Template[]);
      // pick default
      const def = (data as Template[]).find((t) => t.isDefault) ?? data[0];
      setSelectedTemplate(def);
    })();
  }, []);

  const navigate = useNavigate();

  async function handleStart() {
    const prompt = promptRef.current?.value ?? "";
    if (!selectedRepo || !prompt.trim()) {
      setShowErrors(true);
      return;
    }

    const res = await apiClient.post<{ sessionId: string }>(
      routes.startDraft.url,
      {
        repositoryId: selectedRepo.id,
        repositoryName: selectedRepo.name,
        prompt,
        templateId: selectedTemplate?.id,
      },
    );

    const { sessionId } = res.data;
    navigate(`/doc/${sessionId}`);
  }

  // Simple helper to get short relative time strings (e.g., "3h ago")
  function timeAgo(date: Date) {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    const years = Math.floor(days / 365);
    return `${years}y ago`;
  }

  // Memoize draft list to avoid expensive re-renders when typing
  const renderedDocs = useMemo(() => {
    if (docs.length === 0) return null;

    const sorted = [...docs].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

    return sorted.map((doc) => {
      let firstLine = doc.content
        .split("\n")[0]
        .replace(/^#+\s*/, "")
        .trim();
      if (!firstLine) firstLine = "(No title)";

      let statusLabel = "Done";
      let pillClasses = "bg-green-100 text-green-800 hover:bg-green-200";
      if (doc.status === "drafting") {
        statusLabel = "Drafting";
        pillClasses = "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      } else if (doc.status === "error") {
        statusLabel = "Error";
        pillClasses = "bg-red-100 text-red-800 hover:bg-red-200";
      }

      const updated = new Date(doc.updatedAt);
      const relativeStr = timeAgo(updated);

      return (
        <button
          key={doc.id}
          role="listitem"
          aria-label={firstLine}
          tabIndex={0}
          className="flex flex-col border rounded-lg p-3 bg-white hover:bg-gray-50 transition cursor-pointer shadow-sm group min-h-[80px] text-left"
          onClick={() => navigate(`/doc/${doc.id}`)}
        >
          <div className="flex items-center w-full gap-2">
            <div className="font-medium text-base truncate flex-1">
              {firstLine}
            </div>
            <span
              className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${pillClasses}`}
            >
              {statusLabel}
            </span>
          </div>
          <div className="flex-1" />
          <div className="flex items-end w-full mt-2 gap-2">
            <span className="text-xs text-gray-500">{doc.ghRepoName}</span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-400 truncate max-w-[120px]">
              {doc.template.name}
            </span>
            <span
              className="ml-auto text-xs text-gray-400"
              title={updated.toLocaleString()}
            >
              {relativeStr}
            </span>
          </div>
        </button>
      );
    });
  }, [docs, navigate]);

  // Redirect all page scroll events to the draft history
  useEffect(() => {
    const draftHistoryContainer = draftHistoryRef.current;
    if (!draftHistoryContainer) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      draftHistoryContainer.scrollTop += e.deltaY;
    };

    document.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className="p-8 pb-16 sm:pb-0 max-w-2xl mx-auto flex flex-col gap-4 w-full min-h-screen scrollable-page mobile-adjusted">
      {/* New draft section */}
      <div className="relative rounded-lg border bg-white p-4 shadow-sm flex flex-col gap-4">
        {/* Profile / account */}
        <div className="absolute top-4 right-4">
          <UserButton
            appearance={{ elements: { avatarBox: "h-8 w-8" } }}
            afterSignOutUrl="/"
          />
        </div>
        <h2 className="text-base font-semibold text-[#1B9847]">
          Start a new draft
        </h2>

        {/* Repository selector using shadcn Select */}
        <Select
          value={selectedRepo?.id}
          disabled={reposLoading}
          onValueChange={(value) =>
            setSelectedRepo(
              repositories.find((r) => r.id === value) ?? undefined,
            )
          }
        >
          <SelectTrigger
            className={classNames({
              "ring-1 ring-red-500": showErrors && !selectedRepo,
              "opacity-50 cursor-not-allowed": reposLoading,
            })}
          >
            <SelectValue
              placeholder={
                reposLoading ? "Loading repositories…" : "Select a repository…"
              }
            />
            {reposLoading && (
              <svg
                className="animate-spin h-4 w-4 ml-2 text-gray-500"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
          </SelectTrigger>
          <SelectContent>
            {repositories.map((r) => (
              <SelectItem key={r.id} value={r.id}>
                {r.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Prompt textarea (uncontrolled) */}
        <textarea
          ref={promptRef}
          onInput={() => setHasPrompt(!!promptRef.current?.value.trim())}
          placeholder="Describe the feature… e.g. 'Add OAuth login to the dashboard'"
          className={classNames("p-2 w-full border rounded h-32", {
            "ring-1 ring-red-500": showErrors && !hasPrompt,
          })}
        />

        {/* Template selector */}
        <div className="flex overflow-x-auto gap-2 py-1 hide-scrollbar">
          {templates.map((tpl) => (
            <Tooltip key={tpl.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setSelectedTemplate(tpl)}
                  className={classNames(
                    "whitespace-nowrap px-3 py-1 rounded-full border transition-colors",
                    tpl.id === selectedTemplate?.id
                      ? "bg-white text-[#1B9847] border-[#1B9847] ring-1 ring-[#1B9847]/40 hover:bg-[#F6FCF9]"
                      : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300",
                  )}
                >
                  {tpl.name}
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs leading-tight break-words">
                {tpl.description}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <Button
          onClick={handleStart}
          disabled={!selectedRepo || !hasPrompt}
          title="Start a new AI draft"
          className="bg-[#1B9847] hover:bg-[#14843b] disabled:opacity-50"
        >
          Create Draft
        </Button>
      </div>

      {/* Draft history */}
      <div className="flex flex-col flex-1 min-h-0 gap-1">
        <h2 className="text-base font-semibold text-[#1B9847] px-2 pt-1 pb-1.5 border-b border-[#1B9847]/30">
          Draft history
        </h2>
        <div
          ref={draftHistoryRef}
          className="flex flex-col flex-1 min-h-0 overflow-y-auto rounded-lg pt-1 hide-scrollbar"
          style={{ overscrollBehavior: "auto" }}
          role="list"
        >
          {docs.length === 0 ? (
            <div className="text-sm text-gray-500 text-center py-4">
              No drafts yet.
            </div>
          ) : (
            <div className="flex flex-col gap-2 px-2 pb-2" role="presentation">
              {renderedDocs}
            </div>
          )}
        </div>
      </div>

      {showErrors && (!selectedRepo || !hasPrompt) && (
        <p className="text-sm text-red-600">
          Please
          {!selectedRepo && " select a repository"}
          {!selectedRepo && !hasPrompt && " and"}
          {!hasPrompt && " enter a prompt"}
          {" before continuing."}
        </p>
      )}
    </div>
  );
}
