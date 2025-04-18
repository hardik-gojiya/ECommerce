import React, { useState } from "react";

function OrderPage({ setShowOrderModal }) {
    
  const [shippingInfo, setShippingInfo] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    paymentType: "COD",
  });

  const handlePlaceOrder = async () => {
    if (window.confirm("are you sure want to place order?")) {
      setShowOrderModal(false);
    }
    alert("your order has been placed successfully");
  };

  return (
    <div>
      <div className="fixed inset-0  bg-transparent backdrop-blur-xs  bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-lg">
          <h3 className="text-xl font-bold mb-4">Shipping Information</h3>

          <div className="space-y-3">
            {["street", "city", "state", "postalCode", "country"].map(
              (field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={field[0].toUpperCase() + field.slice(1)}
                  className="w-full border p-2 rounded"
                  value={shippingInfo[field]}
                  onChange={(e) =>
                    setShippingInfo({
                      ...shippingInfo,
                      [field]: e.target.value,
                    })
                  }
                />
              )
            )}

            <select
              className="w-full border p-2 rounded"
              value={shippingInfo.paymentType}
              onChange={(e) =>
                setShippingInfo({
                  ...shippingInfo,
                  paymentType: e.target.value,
                })
              }
            >
              <option value="COD">Cash on Delivery</option>
              {/* <option value="Online">Online Payment</option> */}
            </select>
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setShowOrderModal(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handlePlaceOrder}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderPage;
