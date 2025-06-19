interface OfflineSave {
  docId: string;
  content: string;
  updatedAt: string; // Server's last known updatedAt timestamp
  attempts: number;
}

const DB_NAME = "autosave-offline-storage";
const DB_VERSION = 2;
const STORE_NAME = "latest-saves";
const MAX_ATTEMPTS = 3;

class OfflineStorage {
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

        // Delete old store if it exists
        if (db.objectStoreNames.contains("saves")) {
          db.deleteObjectStore("saves");
        }

        if (!db.objectStoreNames.contains(STORE_NAME)) {
          // Use docId as the key - we only store one save per document
          db.createObjectStore(STORE_NAME, { keyPath: "docId" });
        }
      };
    });
  }

  async saveDraft(
    docId: string,
    content: string,
    updatedAt: string,
  ): Promise<void> {
    if (typeof indexedDB === "undefined") return;
    if (!this.db) await this.init();

    const save: OfflineSave = {
      docId,
      content,
      updatedAt,
      attempts: 0,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => resolve();

      // put() will update if exists, insert if new
      store.put(save);
    });
  }

  async getAllOfflineSaves(): Promise<OfflineSave[]> {
    if (typeof indexedDB === "undefined") return [];
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const saves = request.result as OfflineSave[];
        resolve(saves);
      };
    });
  }

  async removeSave(docId: string): Promise<void> {
    if (typeof indexedDB === "undefined") return;
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(docId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async incrementAttempts(docId: string): Promise<void> {
    if (typeof indexedDB === "undefined") return;
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(docId);

      getRequest.onerror = () => reject(getRequest.error);
      getRequest.onsuccess = () => {
        const save = getRequest.result as OfflineSave;
        if (save) {
          save.attempts += 1;

          // Remove if max attempts reached
          if (save.attempts >= MAX_ATTEMPTS) {
            store.delete(docId);
          } else {
            store.put(save);
          }
        }
        resolve();
      };
    });
  }

  // Update the saved content and timestamp for a document
  async updateSave(
    docId: string,
    content: string,
    updatedAt: string,
  ): Promise<void> {
    if (typeof indexedDB === "undefined") return;
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(docId);

      getRequest.onerror = () => reject(getRequest.error);
      getRequest.onsuccess = () => {
        const save = getRequest.result as OfflineSave;
        if (save) {
          // Update content and timestamp, reset attempts
          save.content = content;
          save.updatedAt = updatedAt;
          save.attempts = 0;
          store.put(save);
        } else {
          // Create new save if doesn't exist
          store.put({ docId, content, updatedAt, attempts: 0 });
        }
        resolve();
      };
    });
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

export const offlineStorage = new OfflineStorage();
