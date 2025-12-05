
const API_BASE_URL = 'http://localhost:5050/api';

export interface User {
  id: string;
  firstName: string;
  lastName:string;
  email: string;
  role: string;
  organization?: string;
  region?: string;
}

export class UsersService {
  static async getUsers(): Promise<User[]> {
      
  
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    }
  
}