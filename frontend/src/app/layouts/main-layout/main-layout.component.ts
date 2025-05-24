import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {
  username = localStorage.getItem('username') || 'User';

  onLogout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    location.href = '/login';
  }
}
