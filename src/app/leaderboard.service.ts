import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  private dbName = 'AzureQuizDB';
  private storeName = 'leaderboard';

  constructor() {
    this.initDB();
  }

  private initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject('Error opening database');

      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
      };
    });
  }

  addScore(name: string, score: number): Promise<void> {
    return this.initDB().then(db => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.add({ name, score });

        request.onerror = () => reject('Error adding score');
        request.onsuccess = () => resolve();
      });
    });
  }

  getLeaderboard(): Promise<any[]> {
    return this.initDB().then(db => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();

        request.onerror = () => reject('Error getting leaderboard');
        request.onsuccess = () => {
          const leaderboard = request.result.sort((a, b) => b.score - a.score).slice(0, 10);
          resolve(leaderboard);
        };
      });
    });
  }
}