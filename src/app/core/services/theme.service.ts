import { Injectable, signal } from '@angular/core';

const DARK_THEME_KEY = 'dreamvault-dark-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isDarkTheme = signal(this.readStoredPreference());

  constructor() {
    document.body.classList.toggle('dark-theme', this.isDarkTheme());
  }

  setDarkTheme(enabled: boolean): void {
    this.isDarkTheme.set(enabled);
    document.body.classList.toggle('dark-theme', enabled);

    try {
      localStorage.setItem(DARK_THEME_KEY, String(enabled));
    } catch {
      // Ignore storage errors (private browsing, disabled storage, etc.)
    }
  }

  toggle(): void {
    this.setDarkTheme(!this.isDarkTheme());
  }

  private readStoredPreference(): boolean {
    try {
      return localStorage.getItem(DARK_THEME_KEY) === 'true';
    } catch {
      return false;
    }
  }
}
