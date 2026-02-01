'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

interface UseQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function useQuery<T>(fetcher: () => Promise<T>, deps: any[] = []): UseQueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// Dashboard
export function useFinanceDashboard(period = 'month') {
  return useQuery(() => api.getFinanceDashboard(period), [period]);
}

// Sales
export function useSales(params?: any) {
  return useQuery(() => api.getSales(params), [JSON.stringify(params)]);
}

export function useSalesStats(period = 'month') {
  return useQuery(() => api.getSalesStats(period), [period]);
}

// Influencers
export function useInfluencersFinancial() {
  return useQuery(() => api.getInfluencersFinancial(), []);
}

export function useInfluencerTransactions(id: string) {
  return useQuery(() => api.getInfluencerTransactions(id), [id]);
}

// Agents
export function useAgentsFinancial() {
  return useQuery(() => api.getAgentsFinancial(), []);
}

export function useAgentTransactions(id: string) {
  return useQuery(() => api.getAgentTransactions(id), [id]);
}

// Payouts
export function usePayouts(params?: any) {
  return useQuery(() => api.getPayouts(params), [JSON.stringify(params)]);
}

// Bank Accounts
export function useBankAccounts() {
  return useQuery(() => api.getBankAccounts(), []);
}

// Entries
export function useEntries(params?: any) {
  return useQuery(() => api.getEntries(params), [JSON.stringify(params)]);
}

// Chart of Accounts
export function useChartOfAccounts() {
  return useQuery(() => api.getChartOfAccounts(), []);
}

// Cost Centers
export function useCostCenters() {
  return useQuery(() => api.getCostCenters(), []);
}

// Suppliers
export function useSuppliers() {
  return useQuery(() => api.getSuppliers(), []);
}

// Documents
export function useDocuments() {
  return useQuery(() => api.getDocuments(), []);
}

// Reports
export function useDRE(params?: any) {
  return useQuery(() => api.getDRE(params), [JSON.stringify(params)]);
}

export function useCashFlow(params?: any) {
  return useQuery(() => api.getCashFlow(params), [JSON.stringify(params)]);
}

export function useUnitEconomics(period = 'month') {
  return useQuery(() => api.getUnitEconomics(period), [period]);
}

// Auth hook
export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = api.getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const data = await api.me();
        setUser(data.user);
        setIsAuthenticated(true);
      } catch {
        api.clearToken();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return { user, loading, isAuthenticated, login, logout };
}
