import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SalesService } from '../../services/sales.service'; // ✅ fixed path

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales.component.html',
})
export class SalesComponent {
  items: any[] = [];
  itemUrl = 'http://localhost:5000/api/items';

  toast = {
    message: '',
    type: 'success' as 'success' | 'error' | 'warning',
    show: false,
  };

  constructor(
    private router: Router,
    private salesService: SalesService // ✅ DI works now
  ) {}

  ngOnInit() {
    this.getItems();
  }

  async getItems() {
    try {
      const res = await fetch(this.itemUrl, { credentials: 'include' });
      if (res.ok) {
        this.items = await res.json();
      } else {
        console.error('Failed to fetch items');
      }
    } catch (err) {
      console.error('Error fetching items:', err);
    }
  }

  async sellItem(item: any) {
    if (item.quantity <= 0) {
      return this.showToast('This item is out of stock.', 'warning');
    }

    try {
      const res = await fetch(`${this.itemUrl}/sell/${item._id}`, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (res.ok) {
        await this.getItems();
        this.showToast(`Sold 1x ${item.name}`, 'success');
        this.salesService.notifySaleMade(); // ✅ Notify dashboard
      } else {
        this.showToast('Failed to process sale.', 'error');
      }
    } catch (err) {
      console.error('Error processing sale:', err);
      this.showToast('Failed to process sale.', 'error');
    }
  }

  showToast(message: string, type: 'success' | 'error' | 'warning') {
    this.toast = { message, type, show: true };
    setTimeout(() => (this.toast.show = false), 3000);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
