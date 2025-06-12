import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";

type Repo = { id: string; name: string };
type DocStatus = "drafting" | "completed" | "error";
type Doc = {
  id: string;
  ghRepoName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  status: DocStatus;
};

export default function NewDoc() {
  const [prompt, setPrompt] = useState("");
  const [docs, setDocs] = useState<Doc[]>([]);
  const [repositories, setRepositories] = useState<Repo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<Repo | undefined>();
  const [showErrors, setShowErrors] = useState(false);

  // Fetch repositories on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await routes.fetchRoute("repositories");
        setRepositories(data as Repo[]);
      } catch (err) {
        console.error("Error fetching repositories", err);
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

  const navigate = useNavigate();

  async function handleStart() {
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
      },
    );

    const { sessionId } = res.data;
    navigate(`/doc/${sessionId}`);
  }

  return (
    <div className="p-8 max-w-2xl mx-auto flex flex-col gap-4 w-full h-full">
      {/* Repository selector using shadcn Select */}
      <Select
        value={selectedRepo?.id}
        onValueChange={(value) =>
          setSelectedRepo(repositories.find((r) => r.id === value) ?? undefined)
        }
      >
        <SelectTrigger
          className={classNames({
            "ring-1 ring-red-500": showErrors && !selectedRepo,
          })}
        >
          <SelectValue placeholder="Select a repository…" />
        </SelectTrigger>
        <SelectContent>
          {repositories.map((r) => (
            <SelectItem key={r.id} value={r.id}>
              {r.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Prompt textarea */}
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the feature..."
        className={classNames("p-2 w-full border rounded h-32", {
          "ring-1 ring-red-500": showErrors && !prompt.trim(),
        })}
      />

      <Button onClick={handleStart} disabled={!selectedRepo || !prompt.trim()}>
        Generate Draft
      </Button>

      {/* User Docs List */}
      <div className="flex flex-col gap-2 mt-2 max-h-64 overflow-y-auto border rounded bg-white/80 p-2 shadow-inner">
        {docs.length === 0 ? (
          <div className="text-sm text-gray-500 text-center py-4">
            No drafts yet.
          </div>
        ) : (
          docs
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime(),
            )
            .map((doc) => {
              // Get first line, strip markdown ##
              let firstLine = doc.content
                .split("\n")[0]
                .replace(/^#+\s*/, "")
                .trim();
              if (!firstLine) firstLine = "(No title)";
              // Format date
              const updated = new Date(doc.updatedAt);
              const updatedStr = updated.toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              });
              // Status icon and color
              let StatusIcon = CheckCircle;
              let statusColor = "text-green-600";
              if (doc.status === "drafting") {
                StatusIcon = Loader2;
                statusColor = "text-yellow-600 animate-spin-slow";
              } else if (doc.status === "error") {
                StatusIcon = AlertCircle;
                statusColor = "text-red-600";
              }
              return (
                <button
                  key={doc.id}
                  className="relative flex flex-col border rounded-lg p-3 bg-white hover:bg-gray-50 transition cursor-pointer shadow-sm group min-h-[80px]"
                  onClick={() => navigate(`/doc/${doc.id}`)}
                >
                  {/* Status icon in top right */}
                  <span
                    className={`absolute top-2 right-2 ${statusColor}`}
                    title={doc.status}
                  >
                    <StatusIcon size={20} strokeWidth={2.2} />
                  </span>
                  {/* Title */}
                  <div className="font-medium text-base truncate w-full pr-7 text-left">
                    {firstLine}
                  </div>
                  {/* Spacer to push footer to bottom */}
                  <div className="flex-1" />
                  {/* Footer: repo bottom left, date bottom right */}
                  <div className="flex items-end w-full mt-2">
                    <span className="text-xs text-gray-500 text-left">
                      {doc.ghRepoName}
                    </span>
                    <span
                      className="ml-auto text-xs text-gray-400 text-right"
                      title={updated.toISOString()}
                    >
                      {updatedStr}
                    </span>
                  </div>
                </button>
              );
            })
        )}
      </div>

      {showErrors && (!selectedRepo || !prompt.trim()) && (
        <p className="text-sm text-red-600">
          {`Please ${!selectedRepo ? "select a repository" : ""}${
            !selectedRepo && !prompt.trim() ? " and " : ""
          }${!prompt.trim() ? "enter a prompt" : ""} before continuing.`}
        </p>
      )}
    </div>
  );
}
