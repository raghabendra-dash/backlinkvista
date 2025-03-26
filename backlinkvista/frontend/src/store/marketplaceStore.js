import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const defaultFilters = {
  category: 'all',
  language: 'all',
  priceRange: [0, 1000],
  trafficRange: [0, 1000000],
  domainRating: 0,
  indexing: {
    google: false,
    bing: false
  }
};

export const useMarketplaceStore = create(
  persist(
    (set) => ({
      websites: [],
      filters: defaultFilters,
      cart: [],
      wishlist: [],
      blocklist: [],
      loading: false,
      error: null,
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters }
        })),
      addToCart: (website) =>
        set((state) => {
          const existingItem = state.cart.find(
            (item) => item.websiteId === website.id
          );
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.websiteId === website.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            };
          }
          return {
            cart: [
              ...state.cart,
              { websiteId: website.id, price: website.price, quantity: 1 }
            ]
          };
        }),
      removeFromCart: (websiteId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.websiteId !== websiteId)
        })),
      toggleWishlist: (websiteId) =>
        set((state) => ({
          wishlist: state.wishlist.includes(websiteId)
            ? state.wishlist.filter((id) => id !== websiteId)
            : [...state.wishlist, websiteId]
        })),
      toggleBlocklist: (websiteId) =>
        set((state) => ({
          blocklist: state.blocklist.includes(websiteId)
            ? state.blocklist.filter((id) => id !== websiteId)
            : [...state.blocklist, websiteId]
        })),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearCart: () => set({ cart: [] })
    }),
    {
      name: 'marketplace-storage',
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        blocklist: state.blocklist
      })
    }
  )
);
