// src/app/pages/register/register.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  username = '';
  password = '';

  constructor(private router: Router) {}

  async onRegister() {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // 🔑 important for session
      body: JSON.stringify({ username: this.username, password: this.password }),
    });

    if (res.ok) {
      alert('Registration successful!');
      this.router.navigate(['/login']);
    } else if (res.status === 409) {
      alert('Username already exists.');
    } else {
      alert('Registration failed.');
    }
  }
}
