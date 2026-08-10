// ============================================================
// src/hooks/useProducts.js
// Reusable data-fetching hooks — separates business logic from UI
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { productService, orderService, analyticsService } from "../services/api";

// Generic async hook for any async operation
export function useAsync(asyncFn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  const execute = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const result = await asyncFn();
      setState({ data: result.data, loading: false, error: null });
    } catch (err) {
      setState({ data: null, loading: false, error: err.message });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { execute(); }, [execute]);

  return { ...state, refetch: execute };
}

// Products list with filters
export function useProducts(filters = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filterKey = JSON.stringify(filters);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    productService
      .getAll(filters)
      .then(({ data }) => { if (!cancelled) { setProducts(data); setLoading(false); } })
      .catch((err) => { if (!cancelled) { setError(err.message); setLoading(false); } });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  return { products, loading, error };
}

// Single product
export function useProduct(id) {
  return useAsync(() => productService.getById(id), [id]);
}

// Featured products
export function useFeaturedProducts() {
  return useAsync(() => productService.getFeatured(), []);
}

// Trending products
export function useTrendingProducts() {
  return useAsync(() => productService.getTrending(), []);
}

// Related products
export function useRelatedProducts(productId, category) {
  return useAsync(() => productService.getRelated(productId, category), [productId, category]);
}

// Orders
export function useOrders() {
  return useAsync(() => orderService.getAll(), []);
}

// Admin analytics
export function useAnalytics() {
  return useAsync(() => analyticsService.getDashboardStats(), []);
}

// Local storage hook — persistent state
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (err) {
      console.error(err);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

// Debounce hook — for search inputs
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

// Media query hook
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return matches;
}
