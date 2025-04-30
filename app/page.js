"use client";
import { useState, useEffect } from "react";
import { FaShoppingCart, FaDollarSign } from "react-icons/fa";

// Data produk dari Fake Store API
export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // Ambil data produk dari Fake Store API
  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((data) => {
        // Set Kuota Produk secara manual (Misalnya, setiap produk memiliki kuota 10)
        const updatedData = data.slice(0, 10).map((product) => ({
          ...product,
          stock: 10, // Misalkan setiap produk memiliki kuota 10
        }));
        setProducts(updatedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Fungsi untuk menambah barang ke keranjang
  const addToCart = (product) => {
    if (product.stock > 0) {
      setCart((prevCart) => {
        const productInCart = prevCart.find((item) => item.id === product.id);
        if (productInCart) {
          return prevCart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prevCart, { ...product, quantity: 1 }];
        }
      });
    }
  };

  // Fungsi untuk menghapus barang dari keranjang
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Fungsi untuk mengubah kuantitas barang di keranjang
  const handleQuantityChange = (productId, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: quantity } : item
      )
    );
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-8">
      <h1 className="text-4xl font-bold text-center mb-10 text-purple-800">
        Katalog Produk
      </h1>

      {/* Menampilkan Produk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition duration-300 border border-purple-200"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-semibold text-purple-700">
              {product.title}
            </h2>
            <div className="flex items-center mb-4">
              <FaDollarSign className="text-yellow-500 mr-2" />
              <span className="text-lg font-bold text-purple-800">
                ${product.price}
              </span>
            </div>

            <button
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className={`flex items-center justify-center bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300 ${
                product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FaShoppingCart className="mr-2" />
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        ))}
      </div>

      {/* Cart UI */}
      <div
        className="fixed bottom-20 right-10 bg-purple-600 text-white p-5 rounded-full cursor-pointer flex items-center justify-center"
        onClick={() => setShowCart(!showCart)}
      >
        <FaShoppingCart size={40} />
        <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
          {totalItems}
        </span>
      </div>

      {/* Cart Detail */}
      {showCart && (
        <div className="fixed top-0 right-0 bg-white p-8 w-80 h-full shadow-lg z-50 overflow-y-auto">
          <h2 className="text-2xl font-semibold text-purple-700 mb-6">Cart</h2>
          <div className="space-y-4">
            {cart.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <p>{item.title}</p>
                    <p className="text-sm text-gray-600">
                      ${item.price} x {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.id,
                          Math.max(item.quantity - 1, 1)
                        )
                      }
                      className="px-2 py-1 bg-purple-600 text-white rounded-md mr-2"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.id,
                          Math.min(item.quantity + 1, item.stock)
                        )
                      }
                      className="px-2 py-1 bg-purple-600 text-white rounded-md ml-2"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-4 text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-6">
            <button
              onClick={() => setShowCart(false)}
              className="w-full py-3 bg-purple-600 text-white rounded-lg"
            >
              Close Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
