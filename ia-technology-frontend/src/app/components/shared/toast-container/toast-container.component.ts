import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container-fixed">
      <div *ngFor="let toast of toastService.toasts"
           class="toast-item"
           [class]="'toast-' + toast.type"
           (click)="toastService.remove(toast.id)">
        <div class="toast-icon">
          <i class="fas"
             [class.fa-check-circle]="toast.type === 'success'"
             [class.fa-circle-exclamation]="toast.type === 'error'"
             [class.fa-circle-info]="toast.type === 'info'"
             [class.fa-triangle-exclamation]="toast.type === 'warning'"></i>
        </div>
        <span class="toast-message">{{ toast.message }}</span>
        <button class="toast-close" (click)="$event.stopPropagation(); toastService.remove(toast.id)">
          <i class="fas fa-xmark"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container-fixed {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 380px;
    }
    .toast-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      cursor: pointer;
      font-size: 14px;
      font-family: 'Inter', sans-serif;
      background: white;
      animation: slideIn 0.3s ease-out;
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to   { transform: translateX(0);   opacity: 1; }
    }
    .toast-success { border-left: 4px solid #10B981; }
    .toast-success .toast-icon { color: #10B981; }
    .toast-error   { border-left: 4px solid #EF4444; }
    .toast-error   .toast-icon { color: #EF4444; }
    .toast-info    { border-left: 4px solid #2D5BE3; }
    .toast-info    .toast-icon { color: #2D5BE3; }
    .toast-warning { border-left: 4px solid #F59E0B; }
    .toast-warning .toast-icon { color: #F59E0B; }
    .toast-message { flex: 1; color: #111827; font-weight: 500; }
    .toast-close {
      background: transparent;
      border: none;
      cursor: pointer;
      color: #9CA3AF;
      font-size: 13px;
      padding: 0;
    }
    .toast-close:hover { color: #374151; }
  `]
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) {}
}
