import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'movieshelf_favourite_ids';

const FavouritesContext = createContext(null);

export function FavouritesProvider({ children }) {
  const [favouriteIds, setFavouriteIds] = useState([]); 
  const [loaded, setLoaded] = useState(false);         
  
  useEffect(() => {
    const loadFavourites = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setFavouriteIds(JSON.parse(saved));
      } catch (error) {
        console.log('Could not load favourites:', error);
      } finally {
        setLoaded(true);
      }
    };
    loadFavourites();
  }, []);

  useEffect(() => {
    if (!loaded) return; 
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favouriteIds)).catch((error) =>
      console.log('Could not save favourites:', error)
    );
  }, [favouriteIds, loaded]);

  const isFavourite = (id) => favouriteIds.includes(id);

  const toggleFavourite = (id) => {
    setFavouriteIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const removeFavourite = (id) => {
    setFavouriteIds((current) => current.filter((item) => item !== id));
  };

  return (
    <FavouritesContext.Provider
      value={{ favouriteIds, loaded, isFavourite, toggleFavourite, removeFavourite }}
    >
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  return useContext(FavouritesContext);
}
