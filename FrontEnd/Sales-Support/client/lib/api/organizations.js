// Organizations API client
const API_BASE = '/api/organizations';

// Get authentication token from localStorage or context
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const organizationsApi = {
  // Get all organizations with optional filtering
  async getAll(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'All' && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const url = queryParams.toString() ? `${API_BASE}?${queryParams}` : API_BASE;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch organizations: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data || data; // Handle different response formats
  },

  // Get organization by ID
  async getById(id) {
    const response = await fetch(`${API_BASE}/${id}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch organization: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data || data;
  },

  // Create new organization
  async create(organizationData) {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(organizationData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create organization: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data || data;
  },

  // Update organization
  async update(id, organizationData) {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(organizationData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update organization: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data || data;
  },

  // Delete organization
  async delete(id) {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete organization: ${response.statusText}`);
    }
    
    return true;
  },

  // Migrate data from localStorage to backend
  async migrateData(organizationsData) {
    const response = await fetch(`${API_BASE}/migrate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ organizations: organizationsData })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to migrate organizations: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data || data;
  }
};
