// Example hooks for authentication and API calls
import { useState, useCallback, useEffect } from 'react';
import { apiClient } from './api';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getProfile();
      if (response.success) {
        setUser(response.data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string, role: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.login(email, password, role as any);
      if (response.success && response.data) {
        setUser(response.data.user);
      }
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.register(data);
      if (response.success && response.data) {
        setUser(response.data.user);
      }
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await apiClient.logout();
    setUser(null);
  }, []);

  useEffect(() => {
    // Try to restore session on mount
    if (localStorage.getItem('authToken')) {
      getProfile();
    }
  }, [getProfile]);

  return { user, loading, error, login, register, logout, getProfile };
};

export const useHealthRecords = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async (studentId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getHealthRecords(studentId);
      if (response.success) {
        setRecords(response.data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createRecord = useCallback(async (data: any) => {
    try {
      const response = await apiClient.createHealthRecord(data);
      if (response.success && response.data) {
        setRecords(prev => [response.data, ...prev]);
        return response.data;
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateRecord = useCallback(async (id: string, data: any) => {
    try {
      const response = await apiClient.updateHealthRecord(id, data);
      if (response.success) {
        setRecords(prev => prev.map(r => r.id === id ? response.data : r));
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteRecord = useCallback(async (id: string) => {
    try {
      await apiClient.deleteHealthRecord(id);
      setRecords(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  return { records, loading, error, fetchRecords, createRecord, updateRecord, deleteRecord };
};
