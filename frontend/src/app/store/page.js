'use client';

import { useState, useEffect } from 'react';
import { useCoins } from '@/context/CoinsContext';
import { Trophy, Star, Shield, Zap, Lock, Unlock } from 'lucide-react';
import api from '@/lib/api';

export default function StorePage() {
  const { coins, updateCoins } = useCoins();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get('/store/items');
        if (res.data.success) {
          setItems(res.data.items);
        }
      } catch (err) {
        console.error('Failed to fetch store items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleRedeem = async (item) => {
    if (coins < item.cost) {
      alert("Not enough coins!");
      return;
    }
    
    setPurchasing(item._id);
    
    try {
      const res = await api.post('/store/redeem', { itemId: item._id });
      if(res.data.success) {
        updateCoins(res.data.remainingCoins);
        alert(`Successfully unlocked ${item.name}!`);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Redemption failed.");
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading Store Options...</div>;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="page-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="page-title">Rewards Store</h1>
        <p className="page-description">Spend your hard-earned coins on exclusive cosmetics and features.</p>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.2)', padding: '1rem 2rem', borderRadius: 'var(--radius-full)', marginTop: '1.5rem' }}>
          <Trophy color="var(--coin-gold)" size={24} />
          <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Your Balance:</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--coin-gold)' }}>{coins} Coins</span>
        </div>
      </div>

      <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {items.map((item) => (
          <div key={item._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden' }}>
            
            <div style={{ padding: '2rem 0', display: 'flex', justifyContent: 'center' }}>
               <div style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '50%', border: '1px solid var(--border-color)' }}>
                 {item.icon}
               </div>
            </div>

            <div style={{ flex: 1, textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{item.description}</p>
            </div>

            <div style={{ marginTop: 'auto' }}>
              <button 
                onClick={() => handleRedeem(item)} 
                className={`btn ${coins >= item.cost ? 'btn-primary' : 'btn-secondary'}`} 
                style={{ width: '100%' }}
                disabled={coins < item.cost || purchasing === item._id}
              >
                {purchasing === item._id ? 'Unlocking...' : (
                  <>
                    {coins >= item.cost ? <Unlock size={16} /> : <Lock size={16} />}
                    <span style={{ marginLeft: '0.25rem' }}>{item.cost} Coins</span>
                  </>
                )}
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
