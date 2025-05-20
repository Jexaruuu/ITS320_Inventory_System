// src/app/pages/login/login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private router: Router) {}

  ngOnInit() {
  const isLoggedIn = localStorage.getItem('loggedIn');
  if (isLoggedIn) {
    this.router.navigate(['/dashboard']);
  }
}

 async onLogin() {
  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: this.username,
      password: this.password,
    }),
  });

  if (res.ok) {
  const result = await fetch('http://localhost:5000/api/auth/me', {
    credentials: 'include',
  });
  const data = await result.json();

  localStorage.setItem('loggedIn', 'true');
  localStorage.setItem('username', data.username); // ✅ store username
  this.router.navigate(['/dashboard']);
}
}
}
