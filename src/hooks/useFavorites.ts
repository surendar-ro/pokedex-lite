"use client";

import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem('pokedex_favorites');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse favorites', e);
      }
    }
  }, []);

  const toggleFavorite = (name: string) => {
    setFavorites(prev => {
      let newFavorites;
      if (prev.includes(name)) {
        newFavorites = prev.filter(f => f !== name);
      } else {
        newFavorites = [...prev, name];
      }
      localStorage.setItem('pokedex_favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (name: string) => favorites.includes(name);

  // Return empty/false on server to avoid hydration mismatch
  if (!isMounted) {
    return { favorites: [], toggleFavorite: () => {}, isFavorite: () => false };
  }

  return { favorites, toggleFavorite, isFavorite };
}
