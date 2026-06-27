// IndexedDB persistence helper for KSF Bible Trivia Arena
// Always saves questions, high scores, and user XP in IndexedDB

export interface TriviaQuestion {
  id: string;
  category: string;
  ageGroup: '4-8' | '9-13' | '14-18' | 'Adults';
  question: string;
  options: string[];
  correctAnswer: number; // 0-3
  explanation: string;
}

const DB_NAME = 'ksf_bible_trivia_db';
const DB_VERSION = 1;
const STORE_NAME = 'ksf_trivia_store';

export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error('IndexedDB failed to open:', event);
      reject(new Error('IndexedDB failed to open'));
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

// Low-level helper to write data to IndexedDB key-value pair store
export async function writeValue<T>(key: string, value: T): Promise<void> {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(value, key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error(`Error saving ${key} to IndexedDB:`, error);
  }
}

// Low-level helper to read data from IndexedDB
export async function readValue<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);
      
      request.onsuccess = () => {
        if (request.result !== undefined) {
          resolve(request.result as T);
        } else {
          resolve(defaultValue);
        }
      };
      
      request.onerror = () => {
        resolve(defaultValue);
      };
    });
  } catch (error) {
    console.error(`Error loading ${key} from IndexedDB:`, error);
    return defaultValue;
  }
}
