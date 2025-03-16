"use client";

import { clearToken, getStoredToken, storeToken } from "@/lib/auth.client";
import type { User } from "@/lib/db/schema";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUserData = async (authToken: string) => {
    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      logout();
    }
  };

  const login = (newToken: string) => {
    setToken(newToken);
    storeToken(newToken);
    fetchUserData(newToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    clearToken();
  };

  const refreshUser = async () => {
    if (token) {
      await fetchUserData(token);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getStoredToken();
      if (storedToken) {
        setToken(storedToken);
        await fetchUserData(storedToken);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user && !!token,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
