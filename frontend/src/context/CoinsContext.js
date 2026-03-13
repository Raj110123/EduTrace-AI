'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from './AuthContext';

const CoinsContext = createContext({});

export const CoinsProvider = ({ children }) => {
  const { user } = useAuth();
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    if (user) {
      fetchCoins();
    } else {
      setCoins(0);
    }
  }, [user]);

  const fetchCoins = async () => {
    try {
      const res = await api.get('/coins/balance');
      if (res.data.success) {
        setCoins(res.data.coins);
      }
    } catch (error) {
      console.error("Failed to fetch coins", error);
    }
  };

  const updateCoins = (newAmount) => {
    setCoins(newAmount);
  };

  return (
    <CoinsContext.Provider value={{ coins, updateCoins, fetchCoins }}>
      {children}
    </CoinsContext.Provider>
  );
};

export const useCoins = () => useContext(CoinsContext);
