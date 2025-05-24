import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
})
export class CategoriesComponent {
  categories: any[] = [];
  newCategory = '';
  editingId: string | null = null;
  editingName = '';
  username = ''; // 👈 Define username

  baseUrl = 'http://localhost:5000/api/categories';

  constructor(private router: Router) {}

  ngOnInit() {
    const loggedIn = localStorage.getItem('loggedIn');
    if (!loggedIn) {
      this.router.navigate(['/login']);
    }

    const storedUsername = localStorage.getItem('username'); // 👈 Load from localStorage
    if (storedUsername) {
      this.username = storedUsername;
    }

    this.getCategories();
  }

  onLogout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  async getCategories() {
    try {
      const res = await fetch(this.baseUrl, {
        credentials: 'include',
      });

      if (res.ok) {
        this.categories = await res.json();
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }

  async addCategory() {
    if (!this.newCategory.trim()) return;

    try {
      const res = await fetch(this.baseUrl, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: this.newCategory.trim() }),
      });

      if (res.ok) {
        this.newCategory = '';
        this.getCategories();
      } else {
        console.error('Add category failed');
      }
    } catch (err) {
      console.error('Failed to add category', err);
    }
  }

  startEdit(category: any) {
    this.editingId = category._id;
    this.editingName = category.name;
  }

  async saveEdit(id: string) {
    if (!this.editingName.trim()) return;

    try {
      const res = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: this.editingName.trim() }),
      });

      if (res.ok) {
        this.editingId = null;
        this.editingName = '';
        this.getCategories();
      } else {
        console.error('Edit failed');
      }
    } catch (err) {
      console.error('Failed to update category', err);
    }
  }

  async deleteCategory(id: string) {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const res = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        this.getCategories();
      } else {
        console.error('Delete failed');
      }
    } catch (err) {
      console.error('Failed to delete category', err);
    }
  }
}
