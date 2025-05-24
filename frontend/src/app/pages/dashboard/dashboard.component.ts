import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SalesService } from '../../services/sales.service';
import Chart from 'chart.js/auto'; // ✅ Chart.js must be installed

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  username: string = '';
  totalItems: number = 0;
  totalCategories: number = 0;

  totalSalesToday: number = 0;
  totalSalesCount: number = 0;
  percentChangeAmount: number | null = null;
  percentChangeCount: number | null = null;

  // ✅ Recently Sold Items and Category Chart Data
  recentSales: {
    itemName: string;
    categoryName: string;
    amount: number;
    date: string;
  }[] = [];

  categoryChartData: {
    labels: string[];
    values: number[];
  } = { labels: [], values: [] };

  constructor(private router: Router, private salesService: SalesService) {}

  ngOnInit() {
    const loggedIn = localStorage.getItem('loggedIn');
    if (!loggedIn) {
      this.router.navigate(['/login']);
    }

    this.username = localStorage.getItem('username') || '';
    this.fetchItemCount();
    this.fetchCategoryCount();
    this.fetchTodaySales();
    this.fetchRecentSales();
    this.fetchCategoryDistribution();

    this.salesService.saleMade$.subscribe((made) => {
      if (made) {
        this.fetchTodaySales();
        this.fetchRecentSales();
        this.salesService.resetNotification();
      }
    });
  }

  async fetchItemCount() {
    try {
      const response = await fetch('http://localhost:5000/api/items/count');
      const data = await response.json();
      this.totalItems = data.count;
    } catch (err) {
      console.error('Failed to fetch item count:', err);
    }
  }

  async fetchCategoryCount() {
    try {
      const response = await fetch('http://localhost:5000/api/categories/count');
      const data = await response.json();
      this.totalCategories = data.count;
    } catch (err) {
      console.error('Failed to fetch category count:', err);
    }
  }

  async fetchTodaySales() {
    try {
      const res = await fetch('http://localhost:5000/api/sales/today-total', {
        credentials: 'include',
      });

      const data = await res.json();

      this.totalSalesToday = data.totalAmount;
      this.totalSalesCount = data.totalCount;
      this.percentChangeAmount = data.percentAmountChange;
      this.percentChangeCount = data.percentCountChange;
    } catch (err) {
      console.error("Failed to fetch today's sales", err);
    }
  }

  async fetchRecentSales() {
    try {
      const res = await fetch('http://localhost:5000/api/sales/recent', {
        credentials: 'include',
      });
      this.recentSales = await res.json();
    } catch (err) {
      console.error('Failed to fetch recent sales:', err);
    }
  }

  async fetchCategoryDistribution() {
    try {
      const res = await fetch('http://localhost:5000/api/categories/distribution');
      const data = await res.json();
      this.categoryChartData = data;

      setTimeout(() => this.renderCategoryChart(), 100);
    } catch (err) {
      console.error('Failed to fetch category distribution:', err);
    }
  }

  renderCategoryChart() {
    const ctx = document.getElementById('categoryChart') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.categoryChartData.labels,
        datasets: [{
          label: 'Total Items',
          data: this.categoryChartData.values,
          backgroundColor: '#3B82F6',
        }],
      },
      options: {
        responsive: true,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
        },
      },
    });
  }

  async checkSession() {
    const res = await fetch('http://localhost:5000/api/auth/me', {
      credentials: 'include',
    });

    if (res.ok) {
      const data = await res.json();
      this.username = data.username;
    } else {
      this.router.navigate(['/login']);
    }
  }

  async onLogout() {
    await fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    localStorage.removeItem('loggedIn');
    this.router.navigate(['/login']);
  }
}
