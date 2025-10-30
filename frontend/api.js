// src/api.js
const API_BASE = "http://localhost:8080/api/products";

export const getProducts = async () => {
  const res = await fetch(`${API_BASE}/products`);
  return res.json();
};

export const getCart = async () => {
  const res = await fetch(`${API_BASE}/cart`);
  const data=res.json();
  console.log("get cart data",data)
  return data;
};

export const addToCart = async (productId, qty) => {
  const res = await fetch(`${API_BASE}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, qty }),
  });
  const data=res.json();
  console.log("try to add the data",data);
  return data;
};

export const deleteCartItem = async (id) => {
  const res = await fetch(`${API_BASE}/cart/${id}`, { method: "DELETE" });
  return res.json();
};

export const checkout = async (receiptData) => {
  const res = await fetch(`${API_BASE}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(receiptData),
  });
  const data = await res.json();
  return data;
};

