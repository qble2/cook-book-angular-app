import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SessionStorageService {
  // static RECIPE_SEARCH_SESSION_STORAGE_KEY: string = "recipe_search";

  constructor() {}

  saveString(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  saveObject(key: string, object: any) {
    sessionStorage.setItem(key, JSON.stringify(object));
  }

  getString(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  getObject(key: string): any {
    const object: any = sessionStorage.getItem(key);
    if (object) {
      return JSON.parse(object);
    }
    return null;
    // return {};
  }

  remove(key: string): void {
    sessionStorage.removeItem(key);
  }

  clearAll(): void {
    sessionStorage.clear();
  }
}
