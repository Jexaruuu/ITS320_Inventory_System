import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './items.component.html',
})
export class ItemsComponent {
  items: any[] = [];
  categories: any[] = [];

  // Fields for adding items
  itemName = '';
  itemCategory = '';
  itemQuantity = 0;
  itemPrice = 0;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  // Fields for editing items
  editingItem: any = null;
  editName = '';
  editCategory = '';
  editQuantity = 0;
  editPrice = 0;
  editSelectedFile: File | null = null;
  editImagePreview: string | null = null;

  // URLs
  itemUrl = 'http://localhost:5000/api/items';
  categoryUrl = 'http://localhost:5000/api/categories';

  constructor(private router: Router) {}

  ngOnInit() {
    const loggedIn = localStorage.getItem('loggedIn');
    if (!loggedIn) {
      this.router.navigate(['/login']);
    }

    this.getItems();
    this.getCategories();
  }

  goBack() {
    this.router.navigate(['/dashboard']);
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
      console.error('Fetch items error:', err);
    }
  }

  async getCategories() {
    try {
      const res = await fetch(this.categoryUrl, { credentials: 'include' });
      if (res.ok) {
        this.categories = await res.json();
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (err) {
      console.error('Fetch categories error:', err);
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.imagePreview = null;
    }
  }

  async addItem() {
    const formData = new FormData();
    formData.append('name', this.itemName);
    formData.append('categoryId', this.itemCategory);
    formData.append('quantity', String(this.itemQuantity));
    formData.append('price', String(this.itemPrice));
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    try {
      const res = await fetch(this.itemUrl, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (res.ok) {
        this.itemName = '';
        this.itemCategory = '';
        this.itemQuantity = 0;
        this.itemPrice = 0;
        this.selectedFile = null;
        this.imagePreview = null;
        this.getItems();
      } else {
        alert('Failed to add item.');
      }
    } catch (err) {
      console.error('Failed to add item', err);
    }
  }

  async deleteItem(id: string) {
    try {
      const res = await fetch(`${this.itemUrl}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        this.getItems();
      } else {
        alert('Failed to delete item.');
      }
    } catch (err) {
      console.error('Failed to delete item', err);
    }
  }

  startEdit(item: any) {
    this.editingItem = item;
    this.editName = item.name;
    this.editCategory = item.categoryId?._id || item.categoryId;
    this.editQuantity = item.quantity;
    this.editPrice = item.price;
    this.editSelectedFile = null;
    this.editImagePreview = item.image ? `http://localhost:5000${item.image}` : null;
  }

  cancelEdit() {
    this.editingItem = null;
    this.editSelectedFile = null;
    this.editImagePreview = null;
  }

  onEditFileSelected(event: any) {
    const file = event.target.files[0];
    this.editSelectedFile = file;

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.editImagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async saveEdit() {
    if (!this.editingItem) return;

    const formData = new FormData();
    formData.append('name', this.editName);
    formData.append('categoryId', this.editCategory);
    formData.append('quantity', String(this.editQuantity));
    formData.append('price', String(this.editPrice));
    if (this.editSelectedFile) {
      formData.append('image', this.editSelectedFile);
    }

    try {
      const res = await fetch(`${this.itemUrl}/${this.editingItem._id}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      });

      if (res.ok) {
        this.cancelEdit();
        this.getItems();
      } else {
        alert('Failed to update item.');
      }
    } catch (err) {
      console.error('Edit error:', err);
    }
  }
}
