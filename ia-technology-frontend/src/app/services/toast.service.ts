import { Injectable } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: Toast[] = [];
  private nextId = 0;

  private add(message: string, type: Toast['type'], duration = 4000): void {
    const id = this.nextId++;
    this.toasts.push({ id, message, type, duration });
    setTimeout(() => this.remove(id), duration);
  }

  showSuccess(message: string): void { this.add(message, 'success'); }
  showError(message: string): void   { this.add(message, 'error', 5000); }
  showInfo(message: string): void    { this.add(message, 'info'); }
  showWarning(message: string): void { this.add(message, 'warning'); }

  remove(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }
}
