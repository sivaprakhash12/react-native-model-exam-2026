import React, { createContext, useContext, useState } from 'react';
import { INITIAL_PRODUCTS } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Current active user
  const [user, setUser] = useState({
    id: 'usr-1',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43210',
    address: '42 Blossom Garden, Green Avenue',
    city: 'Chennai',
    postalCode: '600001',
    role: 'customer', // 'customer' | 'admin'
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    walletBalance: 1250.00,
    memberStatus: 'Gold Member',
  });

  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [favorites, setFavorites] = useState(['prod-1', 'prod-2', 'prod-6']);
  const [cart, setCart] = useState([
    {
      product: INITIAL_PRODUCTS[0], // Strawberries
      quantity: 2,
      selectedWeight: '500g',
    },
    {
      product: INITIAL_PRODUCTS[1], // Avocados
      quantity: 1,
      selectedWeight: '3 pcs',
    },
  ]);

  const [orders, setOrders] = useState([
    {
      id: 'ORD-9821',
      date: 'Oct 21, 2026',
      itemsCount: 3,
      totalAmount: 358.00,
      status: 'Delivered',
      items: [
        { name: 'Fresh Organic Strawberries', qty: 2, price: 149.00 },
        { name: 'Organic Whole Pasture Milk', qty: 1, price: 60.00 },
      ],
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null); // { code: 'FRESH20', discountPercent: 20 }
  const [toastMessage, setToastMessage] = useState(null);

  // Helper Toast
  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Switch Role
  const switchRole = (newRole) => {
    setUser((prev) => ({
      ...prev,
      role: newRole,
      name: newRole === 'admin' ? 'Admin Manager' : 'Priya Sharma',
      email: newRole === 'admin' ? 'admin@groceryshop.com' : 'priya.sharma@example.com',
    }));
    showToast(`Switched mode to ${newRole.toUpperCase()}`, 'info');
  };

  // Update Profile
  const updateProfile = (updatedFields) => {
    setUser((prev) => ({ ...prev, ...updatedFields }));
    showToast('Profile updated successfully!', 'success');
  };

  // Favorites Management
  const toggleFavorite = (productId) => {
    if (favorites.includes(productId)) {
      setFavorites((prev) => prev.filter((id) => id !== productId));
      showToast('Removed from Favorites', 'info');
    } else {
      setFavorites((prev) => [...prev, productId]);
      showToast('Added to Favorites ❤️', 'success');
    }
  };

  const isFavorite = (productId) => favorites.includes(productId);

  // Cart Management
  const addToCart = (product, quantity = 1, weight = null) => {
    const chosenWeight = weight || product.weight;
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedWeight === chosenWeight
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [...prevCart, { product, quantity, selectedWeight: chosenWeight }];
      }
    });

    showToast(`Added ${product.name} to cart 🛒`, 'success');
  };

  const updateCartQuantity = (productId, selectedWeight, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.id === productId && item.selectedWeight === selectedWeight) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (productId, selectedWeight) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.product.id === productId && item.selectedWeight === selectedWeight)
      )
    );
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const addAllFavoritesToCart = () => {
    const favoriteProducts = products.filter((p) => favorites.includes(p.id));
    if (favoriteProducts.length === 0) {
      showToast('No favorite items to add', 'warning');
      return;
    }

    favoriteProducts.forEach((product) => {
      addToCart(product, 1);
    });
    showToast(`Added ${favoriteProducts.length} items to cart!`, 'success');
  };

  // Promo Code
  const applyPromoCode = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'FRESH20') {
      setAppliedPromo({ code: 'FRESH20', discountPercent: 20 });
      showToast('20% Promo code applied! 🎉', 'success');
      return { success: true, message: '20% Promo applied!' };
    } else if (clean === 'FREESHIP') {
      setAppliedPromo({ code: 'FREESHIP', freeShipping: true });
      showToast('Free delivery promo applied! 🚚', 'success');
      return { success: true, message: 'Free delivery applied!' };
    } else {
      showToast('Invalid promo code. Try "FRESH20"', 'warning');
      return { success: false, message: 'Invalid promo code' };
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    showToast('Promo code removed', 'info');
  };

  // Place Order
  const placeOrder = (paymentMethod = 'Credit Card') => {
    if (cart.length === 0) {
      showToast('Your cart is empty!', 'warning');
      return null;
    }

    const subtotal = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const discountAmount = appliedPromo?.discountPercent
      ? (subtotal * appliedPromo.discountPercent) / 100
      : 0;
    const deliveryFee = appliedPromo?.freeShipping || subtotal > 300 ? 0 : 40;
    const finalTotal = subtotal - discountAmount + deliveryFee;

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: 'Just now',
      itemsCount: cart.reduce((acc, i) => acc + i.quantity, 0),
      totalAmount: parseFloat(finalTotal.toFixed(2)),
      status: 'Processing',
      paymentMethod,
      items: cart.map((i) => ({
        name: i.product.name,
        qty: i.quantity,
        price: i.product.price,
        weight: i.selectedWeight,
      })),
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedPromo(null);
    return newOrder;
  };

  // Admin Management functions
  const addProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      stock: Number(newProduct.stock) || 20,
      price: Number(newProduct.price) || 2.99,
      originalPrice: Number(newProduct.originalPrice) || Number(newProduct.price) * 1.25,
      availableWeights: newProduct.availableWeights || ['500g', '1kg'],
      nutrition: newProduct.nutrition || { calories: '50 kcal', carbs: '10g', protein: '1g', fiber: '2g' },
    };
    setProducts((prev) => [productWithId, ...prev]);
    showToast(`Added ${newProduct.name} to products!`, 'success');
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
    showToast('Product updated successfully!', 'success');
  };

  const deleteProduct = (id) => {
    const prod = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((item) => item.id !== id));
    setFavorites((prev) => prev.filter((favId) => favId !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    showToast(`Deleted ${prod?.name || 'product'}`, 'info');
  };

  // Cart Counts & Totals
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        switchRole,
        updateProfile,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        favorites,
        toggleFavorite,
        isFavorite,
        addAllFavoritesToCart,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        totalCartCount,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        placeOrder,
        orders,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
