export class AuthService {
  baseUrl = 'http://localhost:5000/api/auth';

  async login(credentials: any): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return res.ok;
  }

  async register(data: any): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.ok;
  }

  async logout(): Promise<void> {
    await fetch(`${this.baseUrl}/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  }
}
