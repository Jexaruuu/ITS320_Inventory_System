import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales.component.html',
})
export class SalesComponent {
  items: any[] = [];
  itemUrl = 'http://localhost:5000/api/items'; // ✅ API URL

  toast = {
    message: '',
    type: 'success',
    show: false,
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.getItems();
  }

  async getItems() {
    const res = await fetch(this.itemUrl, { credentials: 'include' });
    if (res.ok) {
      this.items = await res.json();
    } else {
      console.error('Failed to fetch items');
    }
  }

  async sellItem(item: any) {
    if (item.quantity <= 0) {
      return this.showToast('This item is out of stock.', 'warning');
    }

    const res = await fetch(`${this.itemUrl}/sell/${item._id}`, {
      method: 'PATCH',
      credentials: 'include',
    });

    if (res.ok) {
      this.getItems();
      this.showToast(`Sold 1x ${item.name}`, 'success');
    } else {
      this.showToast('Failed to process sale.', 'error');
    }
  }

  showToast(message: string, type: 'success' | 'error' | 'warning') {
    this.toast = { message, type, show: true };
    setTimeout(() => (this.toast.show = false), 3000);
  }

  // ✅ Back button method
  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
