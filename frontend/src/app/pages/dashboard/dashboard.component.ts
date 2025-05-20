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

  constructor(private router: Router) {}

  ngOnInit() {
    const loggedIn = localStorage.getItem('loggedIn');
    if (!loggedIn) {
      this.router.navigate(['/login']);
    }

    this.username = localStorage.getItem('username') || '';
    this.fetchItemCount();
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
