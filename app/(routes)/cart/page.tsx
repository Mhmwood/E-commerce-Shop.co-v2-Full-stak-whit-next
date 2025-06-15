import React from "react";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            {/* Cart items will be rendered here */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div>
                  <h3 className="font-semibold">Product Name</h3>
                  <p className="text-gray-600">$99.99</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-2 py-1 bg-gray-200 rounded">-</button>
                <span>1</span>
                <button className="px-2 py-1 bg-gray-200 rounded">+</button>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span>$99.99</span>
            </div>
            <button className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
