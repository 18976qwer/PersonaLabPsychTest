import CryptoJS from 'crypto-js';

// In a real app, this key should be an environment variable
// But for client-side storage, any key is visible in source.
// This provides obfuscation rather than true security against a user inspecting their own local storage.
const SECRET_KEY = import.meta.env.VITE_STORAGE_KEY || 'PsychTest_Secr3t_K3y_2025!';

export class StorageManager {
  static setItem(key: string, value: any): void {
    try {
      const jsonValue = JSON.stringify(value);
      const encrypted = CryptoJS.AES.encrypt(jsonValue, SECRET_KEY).toString();
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  static getItem<T>(key: string): T | null {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;

      const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decrypted) return null;
      
      return JSON.parse(decrypted) as T;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  }

  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  static clear(): void {
    localStorage.clear();
  }
}
