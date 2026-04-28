"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, LogIn, LogOut } from 'lucide-react';
import styles from './Header.module.scss';
import classNames from 'classnames';

export default function Header() {
  const [user, setUser] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('pokedex_user');
    if (savedUser) setUser(savedUser);
  }, []);

  const handleLogin = () => {
    // Mock OAuth Flow
    const mockUser = "Ash Ketchum";
    localStorage.setItem('pokedex_user', mockUser);
    setUser(mockUser);
    setShowDropdown(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('pokedex_user');
    setUser(null);
    setShowDropdown(false);
  };

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        <div className={styles.pokeballIcon} />
        <h1>Pokédex Lite</h1>
      </Link>

      <div className={styles.authContainer}>
        {user ? (
          <div className={styles.userMenu}>
            <button 
              className={styles.userButton}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <User size={18} />
              <span className={styles.userName}>{user}</span>
            </button>
            
            {showDropdown && (
              <div className={styles.dropdown}>
                <button onClick={handleLogout} className={styles.dropdownItem}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className={styles.loginButton} onClick={handleLogin}>
            <LogIn size={18} /> Login
          </button>
        )}
      </div>
    </header>
  );
}
