import React, { useState } from "react";

export default function OrderTracking() {
  const [orderId, setOrderId] = useState("");

  const handleTrack = () => {
    // API to get order tracking
    alert(`Tracking order: ${orderId}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Track Orders</h2>
      <div className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded"
        />
        <button
          onClick={handleTrack}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Track Order
        </button>
      </div>
    </div>
  );
}
