"use client";
import { useEffect, useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    setCart(stored ? JSON.parse(stored) : []);
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      const ids = cart.map((item) => item.id).join(",");
      fetch(`/api/products?ids=${ids}`)
        .then((res) => res.json())
        .then((data) => setProducts(data.products || []));
    } else {
      setProducts([]);
    }
  }, [cart]);

  const updateQty = (id, qty) => {
    const newCart = cart.map((item) =>
      item.id === id ? { ...item, qty: Math.max(1, qty) } : item
    );
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const removeItem = (id) => {
    const newCart = cart.filter((item) => item.id !== id);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const total = cart.reduce((sum, item) => {
    const prod = products.find((p) => p.id === item.id);
    return sum + (prod ? prod.price * item.qty : 0);
  }, 0);

  return (
    <main className="dark bg-gray-900 min-h-screen text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <div>Your cart is empty.</div>
      ) : (
        <div className="max-w-2xl mx-auto bg-gray-800 rounded p-6 shadow">
          <ul>
            {cart.map((item) => {
              const prod = products.find((p) => p.id === item.id);
              if (!prod) return null;
              return (
                <li
                  key={item.id}
                  className="flex items-center gap-4 mb-4 border-b border-gray-700 pb-2"
                >
                  <img
                    src={prod.thumbnail}
                    alt={prod.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{prod.title}</div>
                    <div>${prod.price}</div>
                    <input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) =>
                        updateQty(item.id, Number(e.target.value))
                      }
                      className="w-16 text-black mt-2"
                    />
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 text-lg font-bold">
            Total: ${total.toFixed(2)}
          </div>
          <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded font-bold">
            Checkout
          </button>
        </div>
      )}
    </main>
  );
}
