import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { SalesService } from '../../services/sales.service';

// ✅ Import Chart.js components (includes Line chart)
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

// ✅ Register necessary components
Chart.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  username: string = '';
  totalItems: number = 0;
  totalCategories: number = 0;

  totalSalesToday: number = 0;
  totalSalesCount: number = 0;
  percentChangeAmount: number | null = null;
  percentChangeCount: number | null = null;

  recentSales: {
    itemName: string;
    categoryName: string;
    amount: number;
    date: string;
  }[] = [];

  chart: Chart | null = null;
  categorySalesOverTime: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      fill: boolean;
      tension: number;
      pointBackgroundColor: string;
      pointRadius: number;
    }[];
  } = { labels: [], datasets: [] };

  constructor(private router: Router, private salesService: SalesService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.urlAfterRedirects.includes('/dashboard')) {
        this.refreshDashboard();
      }
    });
  }

  ngOnInit() {
    const loggedIn = localStorage.getItem('loggedIn');
    if (!loggedIn) {
      this.router.navigate(['/login']);
    }

    this.username = localStorage.getItem('username') || '';
    this.refreshDashboard();

    this.salesService.saleMade$.subscribe((made) => {
      if (made) {
        this.refreshDashboard();
        this.salesService.resetNotification();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  refreshDashboard() {
    this.fetchItemCount();
    this.fetchCategoryCount();
    this.fetchTodaySales();
    this.fetchRecentSales();
    this.fetchCategorySalesOverTime(); // ✅ updated
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

  // ✅ New fetch for category sales over time
 async fetchCategorySalesOverTime() {
  try {
  const res = await fetch('http://localhost:5000/api/sales/categories/daily-sales', {
  credentials: 'include',
});
    const rawData: {
      categoryName: string;
      date: string;
      totalSold: number;
    }[] = await res.json(); // 👈 explicitly type the response

    const categoryMap: { [category: string]: { [date: string]: number } } = {};
    rawData.forEach((entry) => {
      if (!categoryMap[entry.categoryName]) {
        categoryMap[entry.categoryName] = {};
      }
      categoryMap[entry.categoryName][entry.date] = entry.totalSold;
    });

    const allDates = [...new Set(rawData.map((e) => e.date))].sort();

    this.categorySalesOverTime = {
      labels: allDates,
      datasets: Object.entries(categoryMap).map(([category, dateMap]) => ({
        label: category,
        data: allDates.map((date) => dateMap[date] || 0),
        borderColor: this.getColorForCategory(category),
        fill: false,
        tension: 0.3,
        pointBackgroundColor: this.getColorForCategory(category),
        pointRadius: 4,
      })),
    };

    this.renderChart();
  } catch (error) {
    console.error('Error fetching category sales over time:', error);
  }
}

  getColorForCategory(category: string): string {
    const colors: { [key: string]: string } = {
      Laptop: '#3B82F6',
      Monitor: '#10B981',
      Mouse: '#F59E0B',
      Keyboard: '#EF4444',
      Printer: '#6366F1',
    };
    return colors[category] || '#888888';
  }

  renderChart() {
    const canvas = document.getElementById('categoryChart') as HTMLCanvasElement;
    if (!canvas) return;

    const existingChart = Chart.getChart(canvas);
    if (existingChart) existingChart.destroy();

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.categorySalesOverTime.labels,
        datasets: this.categorySalesOverTime.datasets,
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Items Sold' },
          },
          x: {
            title: { display: true, text: 'Date' },
          },
        },
        plugins: {
          legend: { display: true },
          tooltip: { mode: 'index', intersect: false },
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
