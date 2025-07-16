'use client';

import React, { useEffect, useState } from 'react';
import ItemCard from '../components/ItemCard';
import styles from '../components/css/product.module.css';

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const jsonResp = await response.json();
      setUsers(jsonResp);
      const res = await fetch('/api/load', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index: 'steam-videogames', dryRun: false }),
      });
      const json = await res.json();
      console.log('Upload response:', json);

    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(); // initial load
  }, []);

  return (
    <div className={styles.container}>
      <button onClick={fetchUsers} disabled={loading}>
        {loading ? 'Loading...' : 'Reload Users'}
      </button>
      <div className={styles.productGrid}>
        {users.map(user => (
          <ItemCard key={user.id} />
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
