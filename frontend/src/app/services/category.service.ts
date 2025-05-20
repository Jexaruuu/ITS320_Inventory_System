import { Category } from "../models/category";

export class CategoryService {
  baseUrl = 'http://localhost:5000/api/categories';

  async getAll(): Promise<Category[]> {
    const res = await fetch(this.baseUrl);
    return res.json();
  }

  async create(category: Category): Promise<Category> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    return res.json();
  }

  async update(id: string, category: Category): Promise<Category> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    return res.json();
  }

  async delete(id: string): Promise<void> {
    await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
  }
}
