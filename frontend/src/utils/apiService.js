const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

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
    const response = await this.request('/auth/register', {
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

  async getProjects(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    const endpoint = queryString ? `/projects?${queryString}` : '/projects';
    return this.request(endpoint);
  }

  async getProject(id) {
    return this.request(`/projects/${id}`);
  }

  async createProject(projectData) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(id, projectData) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(id) {
    return this.request(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  async checkoutProject(id) {
    return this.request(`/projects/${id}/checkout`, {
      method: 'POST',
    });
  }

  async checkinProject(id, checkinData) {
    return this.request(`/projects/${id}/checkin`, {
      method: 'POST',
      body: JSON.stringify(checkinData),
    });
  }

  async getProjectActivity(id, filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    const endpoint = queryString ? `/projects/${id}/activity?${queryString}` : `/projects/${id}/activity`;
    return this.request(endpoint);
  }

  async downloadProjectFiles(id) {
    return this.request(`/projects/${id}/download`);
  }

  async addProjectMember(projectId, userId) {
    return this.request(`/projects/${projectId}/members`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async removeProjectMember(projectId, userId) {
    return this.request(`/projects/${projectId}/members/${userId}`, {
      method: 'DELETE',
    });
  }

  async transferProjectOwnership(projectId, newOwnerId) {
    return this.request(`/projects/${projectId}/transfer-ownership`, {
      method: 'POST',
      body: JSON.stringify({ newOwnerId }),
    });
  }

  async createCommit(commitData) {
    return this.request('/commits', {
      method: 'POST',
      body: JSON.stringify(commitData),
    });
  }

  async getProjectCommits(projectId) {
    return this.request(`/projects/project-commits/${projectId}`);
  }

  async getUserCommits(userId) {
    return this.request(`/projects/user-commits/${userId}`);
  }

  async getFriends(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    const endpoint = queryString ? `/friends?${queryString}` : '/friends';
    return this.request(endpoint);
  }

  async sendFriendRequest(friendId, message = '') {
    return this.request('/friends/request', {
      method: 'POST',
      body: JSON.stringify({ friendId, message }),
    });
  }

  async getReceivedFriendRequests(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    const endpoint = queryString ? `/friends/requests?${queryString}` : '/friends/requests';
    return this.request(endpoint);
  }

  async getSentFriendRequests(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    const endpoint = queryString ? `/friends/sent?${queryString}` : '/friends/sent';
    return this.request(endpoint);
  }

  async acceptFriendRequest(requestId) {
    return this.request(`/friends/request/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify({ action: 'accept' }),
    });
  }

  async declineFriendRequest(requestId) {
    return this.request(`/friends/request/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify({ action: 'decline' }),
    });
  }

  async removeFriend(friendId) {
    return this.request(`/friends/${friendId}`, {
      method: 'DELETE',
    });
  }

  async checkFriendshipStatus(userId) {
    return this.request(`/friends/status/${userId}`);
  }

  async getMutualProjects(friendId) {
    return this.request(`/friends/mutual-projects/${friendId}`);
  }

  async search(query, filters = {}) {
    const searchParams = new URLSearchParams({ query, ...filters });
    return this.request(`/search?${searchParams}`);
  }

  async searchHashtags(query, limit = 10) {
    return this.request(`/search/hashtags?query=${encodeURIComponent(query)}&limit=${limit}`);
  }

  async searchTypes(query = '') {
    return this.request(`/search/types?query=${encodeURIComponent(query)}`);
  }

  async advancedSearch(searchData) {
    return this.request('/search/advanced', {
      method: 'POST',
      body: JSON.stringify(searchData),
    });
  }

  async getSearchSuggestions(query, type = 'all', limit = 5) {
    return this.request(`/search/suggestions?query=${encodeURIComponent(query)}&type=${type}&limit=${limit}`);
  }

  async getActivityFeed(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    const endpoint = queryString ? `/activity?${queryString}` : '/activity';
    return this.request(endpoint);
  }

  async getActivityStats(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    const endpoint = queryString ? `/activity/stats?${queryString}` : '/activity/stats';
    return this.request(endpoint);
  }

  async getTrendingProjects(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    const endpoint = queryString ? `/activity/trending?${queryString}` : '/activity/trending';
    return this.request(endpoint);
  }

  async getUserActivity(userId, filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    const endpoint = queryString ? `/activity/user/${userId}?${queryString}` : `/activity/user/${userId}`;
    return this.request(endpoint);
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ profile: profileData }),
    });
  }

  async getUserProfile(userId) {
    return this.request(`/users/${userId}/profile`);
  }

  async getUserById(userId) {
    return this.request(`/users/${userId}`);
  }

  async deleteProfile() {
    return this.request('/auth/profile', {
      method: 'DELETE',
    });
  }

  async checkHealth() {
    try {
      const response = await this.request('/health');
      return response;
    } catch (error) {
      return { status: 'ERROR', error: error.message };
    }
  }
}

const apiService = new ApiService();
export default apiService;