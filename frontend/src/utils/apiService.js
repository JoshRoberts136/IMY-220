const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const token = this.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.token) {
      this.setToken(response.token);
      this.setUser(response.user);
    }

    return response;
  }

  async signup(userData) {
    const response = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.token) {
      this.setToken(response.token);
      this.setUser(response.user);
    }

    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
    } finally {
      this.clearAuth();
    }
  }

  async verifyToken() {
    try {
      const response = await this.request('/auth/verify');
      if (response.success) {
        this.setUser(response.user);
        return response.user;
      }
      return null;
    } catch (error) {
      this.clearAuth();
      return null;
    }
  }

  setToken(token) {
    localStorage.setItem('authToken', token);
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  setUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  }

  clearAuth() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
  }

  isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  async checkHealth() {
    try {
      const response = await this.request('/health');
      return response;
    } catch (error) {
      return { status: 'ERROR', error: error.message };
    }
  }

  // ==================== USER ROUTES ====================

  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/users?${queryString}` : '/users';
    return this.request(endpoint);
  }

  async getUserById(userId) {
    return this.request(`/users/${userId}`);
  }

  // ==================== POST ROUTES ====================

  async getPosts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/posts?${queryString}` : '/posts';
    return this.request(endpoint);
  }

  async getPostById(postId) {
    return this.request(`/posts/${postId}`);
  }

  async createPost(postData) {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async updatePost(postId, postData) {
    return this.request(`/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  }

  async deletePost(postId) {
    return this.request(`/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  // ==================== POST INTERACTION ROUTES ====================

  async likePost(postId) {
    return this.request(`/posts/${postId}/like`, {
      method: 'POST',
    });
  }

  async addComment(postId, commentData) {
    return this.request(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  }

  async deleteComment(postId, commentId) {
    return this.request(`/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
    });
  }

  // ==================== STATISTICS ROUTES ====================

  async getStats() {
    return this.request('/stats');
  }

  async getTrendingPosts() {
    return this.request('/posts/trending');
  }

  async getCategories() {
    return this.request('/categories');
  }

  async getTags() {
    return this.request('/tags');
  }

  // ==================== MESSAGES ROUTES ====================

  async getMessages(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/messages?${queryString}` : '/messages';
    return this.request(endpoint);
  }

  // ==================== FILES ROUTES ====================

  async getFiles(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/files?${queryString}` : '/files';
    return this.request(endpoint);
  }

  // ==================== LANGUAGES ROUTES ====================

  async getLanguages(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/languages?${queryString}` : '/languages';
    return this.request(endpoint);
  }

  // ==================== COMMITS ROUTES ====================

  async getCommits(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/commits?${queryString}` : '/commits';
    return this.request(endpoint);
  }
}

const apiService = new ApiService();
export default apiService;