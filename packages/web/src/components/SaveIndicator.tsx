import type { AutosaveState } from "@/hooks/useAutosave";

interface SaveIndicatorProps {
  state: AutosaveState;
  lastSaved: Date | null;
  error: string | null;
}

export default function SaveIndicator({
  state,
  lastSaved,
  error,
}: SaveIndicatorProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getStatusText = () => {
    switch (state) {
      case "saving":
        return "Saving...";
      case "saved":
        return "Saved ✓";
      case "offline":
        return "Offline (will retry)";
      case "error":
        return error || "Save failed";
      case "idle":
      default:
        return lastSaved ? `Last saved ${formatTime(lastSaved)}` : null;
    }
  };

  const getStatusColor = () => {
    switch (state) {
      case "saving":
        return "text-blue-600";
      case "saved":
        return "text-green-600";
      case "offline":
        return "text-orange-600";
      case "error":
        return "text-red-600";
      case "idle":
      default:
        return "text-gray-500";
    }
  };

  const statusText = getStatusText();
  if (!statusText) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 px-3 py-2 rounded-md bg-white shadow-lg border ${getStatusColor()} text-sm font-medium`}
      role="status"
      aria-live="polite"
      title={error || undefined}
    >
      {state === "saving" && (
        <svg
          className="inline w-4 h-4 mr-2 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {statusText}
    </div>
  );
}
