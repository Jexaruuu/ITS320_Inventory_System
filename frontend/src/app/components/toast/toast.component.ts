import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="show"
      [ngClass]="{
        'bg-green-600': type === 'success',
        'bg-red-600': type === 'error',
        'bg-yellow-500': type === 'warning'
      }"
      class="fixed bottom-6 right-6 px-4 py-3 text-white rounded shadow-lg transition-opacity duration-300"
    >
      {{ message }}
    </div>
  `,
})
export class ToastComponent {
  @Input() message = '';
  @Input() type: 'success' | 'error' | 'warning' = 'success';
  @Input() show = false;
}
