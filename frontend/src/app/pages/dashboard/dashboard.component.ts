import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  username: string = '';
  totalItems: number = 0;
  totalCategories: number = 0; // 👈 Add this

  constructor(private router: Router) {}
  totalSalesToday: number = 0;

ngOnInit() {
  const loggedIn = localStorage.getItem('loggedIn');
  if (!loggedIn) {
    this.router.navigate(['/login']);
  }

  this.username = localStorage.getItem('username') || '';
  this.fetchItemCount();
  this.fetchCategoryCount();
  this.fetchTodaySales(); // ✅ MUST be called
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
  console.log("Fetching today's sales..."); // 🔍 Debug log

  try {
    const res = await fetch('http://localhost:5000/api/sales/today-total', {
      credentials: 'include',
    });

    const data = await res.json();
    console.log("Sales response:", data); // 🔍 Debug response

    this.totalSalesToday = data.total;
  } catch (err) {
    console.error("Failed to fetch today's sales", err);
  }
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

