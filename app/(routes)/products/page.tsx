import React from "react";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">All Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Product cards will be rendered here */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Product Name</h3>
            <p className="text-gray-600 mb-2">Product description</p>
            <p className="text-xl font-bold text-blue-600">$99.99</p>
          </div>
        </div>
      </div>
    </div>
  );
}
