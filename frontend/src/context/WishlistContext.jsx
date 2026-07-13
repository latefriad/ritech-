/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect } from "react";

const WishlistContext = createContext();

export function useWishlist() {
  return useContext(WishlistContext);
}

function loadWishlist() {
  try {
    const saved = localStorage.getItem("gehazek_wishlist");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(loadWishlist);

  useEffect(() => {
    localStorage.setItem("gehazek_wishlist", JSON.stringify(items));
  }, [items]);

  const toggleWishlist = useCallback((product) => {
    setItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  }, []);

  const isWishlisted = useCallback(
    (id) => items.some((item) => item.id === id),
    [items]
  );

  return (
    <WishlistContext.Provider value={{ items, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}
