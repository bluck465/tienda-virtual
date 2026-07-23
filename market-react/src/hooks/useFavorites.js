import { useState, useEffect, useCallback } from 'react';
import { getFavorites, saveFavorites } from '../services/storage.js';

export default function useFavorites() {
  const [favorites, setFavorites] = useState(getFavorites);

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const toggleFavorite = useCallback(productId => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const favoriteCount = favorites.length;

  return { favorites, toggleFavorite, favoriteCount };
}
