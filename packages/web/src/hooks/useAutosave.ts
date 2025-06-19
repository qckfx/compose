import { useCallback, useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";
import apiClient from "@/api/apiClient";
import { offlineStorage } from "@/utils/offlineStorage";

export type AutosaveState = "idle" | "saving" | "saved" | "error" | "offline";

interface UseAutosaveOptions {
  docId: string;
  initialUpdatedAt: string;
  clientId: string;
  debounceMs?: number;
  maxCharacters?: number;
}

export function useAutosave({
  docId,
  initialUpdatedAt,
  clientId,
  debounceMs = 5000,
  maxCharacters = 500,
}: UseAutosaveOptions) {
  const [state, setState] = useState<AutosaveState>("idle");
  const [lastSaved, setLastSaved] = useState<Date>(new Date(initialUpdatedAt));
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const contentRef = useRef<string>("");
  const lastSavedContentRef = useRef<string>("");
  const characterCountRef = useRef<number>(0);
  const isOnlineRef = useRef<boolean>(true);

  // Process offline saves when coming back online
  const processOfflineSaves = useCallback(async () => {
    try {
      const pendingSaves = await offlineStorage.getAllOfflineSaves();

      for (const save of pendingSaves) {
        try {
          const response = await apiClient.put(`/api/doc/${save.docId}`, {
            content: save.content,
            updatedAt: save.updatedAt,
            clientId,
          });

          // Update our timestamp if this was our document
          if (save.docId === docId) {
            const savedAt = new Date(response.data.updatedAt);
            setLastSaved(savedAt);
          }

          await offlineStorage.removeSave(save.docId);
        } catch (err) {
          if (err instanceof AxiosError) {
            if (err.response?.status === 409) {
              // Conflict - only show error for current doc, silently skip others
              if (save.docId === docId) {
                setError("Document was updated elsewhere");
                setState("error");
                // Keep the save - user needs to decide what to do
              } else {
                // For other docs, just remove the conflict
                await offlineStorage.removeSave(save.docId);
              }
            } else {
              // Server error or network error - keep it and increment attempts
              await offlineStorage.incrementAttempts(save.docId);
            }
          } else {
            // Unknown error - keep it and increment attempts
            await offlineStorage.incrementAttempts(save.docId);
          }
        }
      }
    } catch (err) {
      console.error("Error processing offline saves:", err);
    }
  }, [docId]);

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
        // Process any offline saves
        await processOfflineSaves();
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
  }, [state, processOfflineSaves]);

  // Note: Offline saves are now handled in DocView to show the right content
  // We only process them here when coming back online

  const saveContent = useCallback(
    async (content: string) => {
      // Don't save if content hasn't changed
      if (content === lastSavedContentRef.current) {
        return;
      }

      if (!isOnlineRef.current) {
        // Queue the save for when we're back online
        try {
          await offlineStorage.saveDraft(
            docId,
            content,
            lastSaved.toISOString(),
          );
          setState("offline");
        } catch (err) {
          console.error("Failed to store offline save:", err);
          setError("Failed to save offline");
          setState("error");
        }
        return;
      }

      try {
        setState("saving");
        setError(null);

        const response = await apiClient.put(`/api/doc/${docId}`, {
          content,
          updatedAt: lastSaved.toISOString(),
          clientId,
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
            await offlineStorage.saveDraft(
              docId,
              content,
              lastSaved.toISOString(),
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

  // Save any pending content before unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Check if we have unsaved content
      if (contentRef.current !== lastSavedContentRef.current) {
        // Save to offline storage - will be synced when user returns
        offlineStorage
          .saveDraft(docId, contentRef.current, lastSaved.toISOString())
          .catch((err) => {
            console.error("Failed to save draft on unload:", err);
          });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [docId, lastSaved]);

  const clearOfflineSave = useCallback(async () => {
    try {
      await offlineStorage.removeSave(docId);
      setError(null);
      setState("idle");
    } catch (err) {
      console.error("Failed to clear offline save:", err);
    }
  }, [docId]);

  return {
    state,
    lastSaved,
    error,
    triggerSave,
    forceSave,
    clearOfflineSave,
  };
}
