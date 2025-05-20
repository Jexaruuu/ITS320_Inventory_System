import { Item } from "../models/item";

export class ItemService {
  baseUrl = 'http://localhost:5000/api/items';

  async getAll(): Promise<Item[]> {
    const res = await fetch(this.baseUrl);
    return res.json();
  }

  async create(formData: FormData): Promise<Item> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      body: formData,
    });
    return res.json();
  }

  async update(id: string, item: Partial<Item>): Promise<Item> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return res.json();
  }

  async delete(id: string): Promise<void> {
    await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
  }

  async sell(id: string): Promise<Item> {
    const res = await fetch(`${this.baseUrl}/sell/${id}`, { method: 'PATCH' });
    return res.json();
  }
}
