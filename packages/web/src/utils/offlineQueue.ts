interface QueuedSave {
  id: string;
  docId: string;
  content: string;
  timestamp: number;
  attempts: number;
}

const DB_NAME = "autosave-offline-queue";
const DB_VERSION = 1;
const STORE_NAME = "saves";
const MAX_QUEUE_SIZE = 20;
const MAX_ATTEMPTS = 3;

class OfflineQueue {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    // Skip if no indexedDB (SSR)
    if (typeof indexedDB === "undefined") {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
          store.createIndex("docId", "docId", { unique: false });
          store.createIndex("timestamp", "timestamp", { unique: false });
        }
      };
    });
  }

  async addSave(docId: string, content: string): Promise<void> {
    if (typeof indexedDB === "undefined") return;
    if (!this.db) await this.init();

    const save: QueuedSave = {
      id: `${docId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      docId,
      content,
      timestamp: Date.now(),
      attempts: 0,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => resolve();

      // Clean up old saves to maintain queue size
      this.cleanupOldSaves(store);

      store.add(save);
    });
  }

  async getPendingSaves(): Promise<QueuedSave[]> {
    if (typeof indexedDB === "undefined") return [];
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const saves = request.result as QueuedSave[];
        // Sort by timestamp to process oldest first
        saves.sort((a, b) => a.timestamp - b.timestamp);
        resolve(saves);
      };
    });
  }

  async removeSave(id: string): Promise<void> {
    if (typeof indexedDB === "undefined") return;
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async incrementAttempts(id: string): Promise<void> {
    if (typeof indexedDB === "undefined") return;
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(id);

      getRequest.onerror = () => reject(getRequest.error);
      getRequest.onsuccess = () => {
        const save = getRequest.result as QueuedSave;
        if (save) {
          save.attempts += 1;

          // Remove if max attempts reached
          if (save.attempts >= MAX_ATTEMPTS) {
            store.delete(id);
          } else {
            store.put(save);
          }
        }
        resolve();
      };
    });
  }

  private cleanupOldSaves(store: IDBObjectStore): void {
    const countRequest = store.count();
    countRequest.onsuccess = () => {
      if (countRequest.result >= MAX_QUEUE_SIZE) {
        const index = store.index("timestamp");
        const cursorRequest = index.openCursor();
        let deleted = 0;
        const toDelete = countRequest.result - MAX_QUEUE_SIZE + 1;

        cursorRequest.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor && deleted < toDelete) {
            store.delete(cursor.primaryKey);
            deleted++;
            cursor.continue();
          }
        };
      }
    };
  }

  async clear(): Promise<void> {
    if (typeof indexedDB === "undefined") return;
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

export const offlineQueue = new OfflineQueue();
