'use client';

import { account } from './appwrite';
import { ID } from 'appwrite';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  studentId: string;
}

/**
 * Authentication service using Appwrite
 */
export class AuthService {
  /**
   * Login with email and password
   */
  static async login(credentials: LoginCredentials) {
    try {
      const session = await account.createEmailPasswordSession(
        credentials.email,
        credentials.password
      );
      return { success: true, session };
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed. Please check your credentials.' 
      };
    }
  }

  /**
   * Register a new user
   */
  static async register(data: RegisterData) {
    try {
      const user = await account.create(ID.unique(), data.email, data.password, data.name);
      return { success: true, user };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.message || 'Registration failed.' 
      };
    }
  }

  /**
   * Logout current user
   */
  static async logout() {
    try {
      await account.deleteSession('current');
      return { success: true };
    } catch (error: any) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get current user session
   */
  static async getCurrentUser() {
    try {
      const user = await account.get();
      return { success: true, user };
    } catch (error: any) {
      return { success: false, user: null, error: error.message };
    }
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      await account.get();
      return true;
    } catch {
      return false;
    }
  }
}
