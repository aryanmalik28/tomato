


import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItem, setCartItem] = useState({});
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const url = "https://tomato-backend-2ral.onrender.com";

  // Load cart data from localStorage and fetch initial data
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cartItem")) || {};
    setCartItem(storedCart);

    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      loadCartData(storedToken);
    }

    fetchFoodList();
  }, []);

  // Update localStorage whenever cartItem changes
  useEffect(() => {
    localStorage.setItem("cartItem", JSON.stringify(cartItem));
  }, [cartItem]);

  const addToCart = async (itemId) => {
    setCartItem((prev) => {
      const newCart = { ...prev, [itemId]: (prev[itemId] || 0) + 1 };
      localStorage.setItem("cartItem", JSON.stringify(newCart));
      return newCart;
    });

    if (token) {
      try {
        await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { token } });
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItem((prev) => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1;
      } else {
        delete newCart[itemId];
      }
      localStorage.setItem("cartItem", JSON.stringify(newCart));
      return newCart;
    });

    if (token) {
      try {
        await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { token } });
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItem) {
      if (cartItem[item] > 0) {
        const itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItem[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.data || []);
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(`${url}/api/cart/get`, {}, {
        headers: { token }
      });
      if (response.data && response.data.cartData) {
        setCartItem(response.data.cartData);
      } else {
        console.warn('No cart data found');
        setCartItem({});
      }
    } catch (error) {
      console.error('Error loading cart data:', error);
      setCartItem({});
    }
  };
 


  const contextValue = {
    food_list,
    cartItem,
    setCartItem,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;

