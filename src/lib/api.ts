const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.psiuu.app/api';

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', token);
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('admin_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      this.clearToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' });
    this.clearToken();
  }

  async me() {
    return this.request<{ user: any }>('/auth/me');
  }

  // Finance - Dashboard
  async getFinanceDashboard(period = 'month') {
    return this.request<any>(`/finance/dashboard?period=${period}`);
  }

  // Finance - Sales
  async getSales(params?: { start_date?: string; end_date?: string; method?: string; influencer_id?: string; per_page?: number }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any>(`/finance/sales${query ? `?${query}` : ''}`);
  }

  async getSalesStats(period = 'month') {
    return this.request<any>(`/finance/sales/stats?period=${period}`);
  }

  // Finance - Influencers
  async getInfluencersFinancial() {
    return this.request<any>('/finance/influencers');
  }

  async getInfluencerTransactions(id: string) {
    return this.request<any>(`/finance/influencers/${id}/transactions`);
  }

  // Finance - Agents
  async getAgentsFinancial() {
    return this.request<any>('/finance/agents');
  }

  async getAgentTransactions(id: string) {
    return this.request<any>(`/finance/agents/${id}/transactions`);
  }

  // Finance - Payouts
  async getPayouts(params?: { status?: string; type?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any>(`/finance/payouts${query ? `?${query}` : ''}`);
  }

  async createPayout(data: any) {
    return this.request<any>('/finance/payouts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async processPayout(id: string) {
    return this.request<any>(`/finance/payouts/${id}/process`, { method: 'POST' });
  }

  async completePayout(id: string) {
    return this.request<any>(`/finance/payouts/${id}/complete`, { method: 'POST' });
  }

  async cancelPayout(id: string, reason?: string) {
    return this.request<any>(`/finance/payouts/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // Finance - Bank Accounts
  async getBankAccounts() {
    return this.request<any>('/finance/bank-accounts');
  }

  async createBankAccount(data: any) {
    return this.request<any>('/finance/bank-accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBankAccount(id: string, data: any) {
    return this.request<any>(`/finance/bank-accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBankAccount(id: string) {
    return this.request<any>(`/finance/bank-accounts/${id}`, { method: 'DELETE' });
  }

  // Finance - Entries (Lançamentos)
  async getEntries(params?: { status?: string; type?: string; start_date?: string; end_date?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any>(`/finance/entries${query ? `?${query}` : ''}`);
  }

  async createEntry(data: any) {
    return this.request<any>('/finance/entries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEntry(id: string, data: any) {
    return this.request<any>(`/finance/entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async payEntry(id: string) {
    return this.request<any>(`/finance/entries/${id}/pay`, { method: 'POST' });
  }

  async cancelEntry(id: string) {
    return this.request<any>(`/finance/entries/${id}/cancel`, { method: 'POST' });
  }

  async deleteEntry(id: string) {
    return this.request<any>(`/finance/entries/${id}`, { method: 'DELETE' });
  }

  // Finance - Chart of Accounts
  async getChartOfAccounts() {
    return this.request<any>('/finance/chart-of-accounts');
  }

  async createChartOfAccount(data: any) {
    return this.request<any>('/finance/chart-of-accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateChartOfAccount(id: string, data: any) {
    return this.request<any>(`/finance/chart-of-accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteChartOfAccount(id: string) {
    return this.request<any>(`/finance/chart-of-accounts/${id}`, { method: 'DELETE' });
  }

  // Finance - Cost Centers
  async getCostCenters() {
    return this.request<any>('/finance/cost-centers');
  }

  async createCostCenter(data: any) {
    return this.request<any>('/finance/cost-centers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCostCenter(id: string, data: any) {
    return this.request<any>(`/finance/cost-centers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCostCenter(id: string) {
    return this.request<any>(`/finance/cost-centers/${id}`, { method: 'DELETE' });
  }

  // Finance - Suppliers
  async getSuppliers() {
    return this.request<any>('/finance/suppliers');
  }

  async createSupplier(data: any) {
    return this.request<any>('/finance/suppliers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSupplier(id: string, data: any) {
    return this.request<any>(`/finance/suppliers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSupplier(id: string) {
    return this.request<any>(`/finance/suppliers/${id}`, { method: 'DELETE' });
  }

  // Finance - Documents
  async getDocuments() {
    return this.request<any>('/finance/documents');
  }

  async uploadDocument(formData: FormData) {
    const token = this.getToken();
    const response = await fetch(`${API_BASE_URL}/finance/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return response.json();
  }

  async deleteDocument(id: string) {
    return this.request<any>(`/finance/documents/${id}`, { method: 'DELETE' });
  }

  // Finance - Reports
  async getDRE(params?: { start_date?: string; end_date?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any>(`/finance/reports/dre${query ? `?${query}` : ''}`);
  }

  async getCashFlow(params?: { start_date?: string; end_date?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any>(`/finance/reports/cash-flow${query ? `?${query}` : ''}`);
  }

  async getUnitEconomics(period = 'month') {
    return this.request<any>(`/finance/reports/unit-economics?period=${period}`);
  }

  // Messaging Stats
  async getSmsStats() {
    return this.request<any>('/sms/stats');
  }

  async getWhatsAppStats() {
    return this.request<any>('/whatsapp/stats');
  }
}

export const api = new ApiClient();
export default api;
