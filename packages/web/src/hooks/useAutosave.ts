import { useCallback, useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";
import apiClient from "@/api/apiClient";
import { offlineQueue } from "@/utils/offlineQueue";

export type AutosaveState = "idle" | "saving" | "saved" | "error" | "offline";

interface UseAutosaveOptions {
  docId: string;
  initialUpdatedAt?: string | null;
  debounceMs?: number;
  maxCharacters?: number;
}

export function useAutosave({
  docId,
  initialUpdatedAt,
  debounceMs = 5000,
  maxCharacters = 500,
}: UseAutosaveOptions) {
  const [state, setState] = useState<AutosaveState>("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(
    initialUpdatedAt ? new Date(initialUpdatedAt) : null,
  );
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const contentRef = useRef<string>("");
  const lastSavedContentRef = useRef<string>("");
  const characterCountRef = useRef<number>(0);
  const isOnlineRef = useRef<boolean>(true);

  // Process offline queue when coming back online
  const processOfflineQueue = useCallback(async () => {
    try {
      const pendingSaves = await offlineQueue.getPendingSaves();

      for (const save of pendingSaves) {
        try {
          await apiClient.put(`/api/doc/${save.docId}`, {
            content: save.content,
          });
          await offlineQueue.removeSave(save.id);
        } catch {
          await offlineQueue.incrementAttempts(save.id);
        }
      }
    } catch (err) {
      console.error("Error processing offline queue:", err);
    }
  }, []);

  // Track online/offline status
  useEffect(() => {
    // Initialize online status
    if (typeof navigator !== "undefined") {
      isOnlineRef.current = navigator.onLine;
    }

    const handleOnline = async () => {
      isOnlineRef.current = true;
      if (state === "offline") {
        setState("idle");
        // Process any queued saves
        await processOfflineQueue();
      }
    };

    const handleOffline = () => {
      isOnlineRef.current = false;
      setState("offline");
    };

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, [state, processOfflineQueue]);

  const saveContent = useCallback(
    async (content: string) => {
      // Don't save if content hasn't changed
      if (content === lastSavedContentRef.current) {
        return;
      }

      if (!isOnlineRef.current) {
        // Queue the save for when we're back online
        try {
          await offlineQueue.addSave(
            docId,
            content,
            lastSaved?.toISOString() || "",
          );
          setState("offline");
        } catch (err) {
          console.error("Failed to queue offline save:", err);
          setError("Failed to queue save");
          setState("error");
        }
        return;
      }

      try {
        setState("saving");
        setError(null);

        const response = await apiClient.put(`/api/doc/${docId}`, {
          content,
          updatedAt: lastSaved?.toISOString(),
        });

        lastSavedContentRef.current = content;
        // Use the server's timestamp to stay in sync
        const savedAt = new Date(response.data.updatedAt);
        setLastSaved(savedAt);
        setState("saved");

        // Return to idle after 2 seconds unless saving again
        setTimeout(() => {
          setState((current) => (current === "saved" ? "idle" : current));
        }, 2000);
      } catch (err) {
        console.error("Autosave failed:", err);

        if (err instanceof AxiosError && err.response?.status === 409) {
          // Conflict - server has newer content
          setError("Document was updated elsewhere");
          setState("error");
        } else if (!isOnlineRef.current) {
          // Connection lost during save - queue it
          try {
            await offlineQueue.addSave(
              docId,
              content,
              lastSaved?.toISOString() || "",
            );
            setState("offline");
          } catch (queueErr) {
            console.error(
              "Failed to queue save after network error:",
              queueErr,
            );
            setError("Failed to save changes");
            setState("error");
          }
        } else {
          setError("Failed to save changes");
          setState("error");
        }
      }
    },
    [docId, lastSaved],
  );

  const triggerSave = useCallback(
    (content: string, immediate = false) => {
      contentRef.current = content;

      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Check if we should save immediately based on character count
      const characterDelta = Math.abs(
        content.length - lastSavedContentRef.current.length,
      );
      characterCountRef.current += characterDelta;

      const shouldSaveImmediately =
        immediate || characterCountRef.current >= maxCharacters;

      if (shouldSaveImmediately) {
        characterCountRef.current = 0;
        saveContent(content);
      } else {
        // Set up debounced save
        timerRef.current = setTimeout(() => {
          characterCountRef.current = 0;
          saveContent(contentRef.current);
        }, debounceMs);
      }
    },
    [saveContent, debounceMs, maxCharacters],
  );

  const forceSave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    saveContent(contentRef.current);
  }, [saveContent]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Handle Ctrl+S shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        forceSave();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [forceSave]);

  return {
    state,
    lastSaved,
    error,
    triggerSave,
    forceSave,
  };
}
