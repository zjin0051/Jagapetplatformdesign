import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WishlistContextType {
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  clearWishlist: () => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  toggleWishlist: () => {},
  clearWishlist: () => {},
  isInWishlist: () => false,
});

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const clearWishlist = () => setWishlist([]);

  const isInWishlist = (id: string) => wishlist.includes(id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, clearWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
