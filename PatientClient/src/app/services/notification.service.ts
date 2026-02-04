import { Injectable, signal } from '@angular/core';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _notification = signal<Notification | null>(null);
  
  // Public readonly access if preferred, or just public signal
  public notification = this._notification.asReadonly();

  show(message: string, type: 'success' | 'error' | 'info' = 'success') {
    this._notification.set({ message, type });
    setTimeout(() => {
      this._notification.set(null);
    }, 3000);
  }

  clear() {
    this._notification.set(null);
  }
}
