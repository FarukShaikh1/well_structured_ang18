import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CacheService {
  set(key: string, data: any): void {
    const payload = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(payload));
  }

  get<T>(key: string, maxAgeMinutes: number = 720): T | null {
    const item = localStorage.getItem(key);
    if (!item) return null;

    try {
      const parsed = JSON.parse(item);
      const now = Date.now();
      const age = (now - parsed.timestamp) / (1000 * 60);
      if (age > maxAgeMinutes) {
        // cache expired
        localStorage.removeItem(key);
        return null;
      }
      return parsed.data as T;
    } catch {
      localStorage.removeItem(key);
      return null;
    }
  }

  clear(key: string): void {
    localStorage.removeItem(key);
  }
}
