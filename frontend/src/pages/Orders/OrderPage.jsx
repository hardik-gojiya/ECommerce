import React, { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { useLogin } from "../../context/LoginContext";

function OrderPage({ setShowOrderModal, handlePlaceOrder }) {
  const { showError, showSuccess } = useToast();
  const { shippingAdress } = useLogin();

  const [userDescription, setuserDescription] = useState("");
  const [shippingInfo, setShippingInfo] = useState({
    street: shippingAdress.street || "",
    city: shippingAdress.city || "",
    state: shippingAdress.state || "",
    postalCode: shippingAdress.postalCode || "",
    country: shippingAdress.country || "",
    paymentType: "COD",
  });

  return (
    <div>
      <div className="fixed inset-0  bg-transparent backdrop-blur-xs  bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-lg">
          <h3 className="text-xl font-bold mb-4">Shipping Information</h3>

          <textarea
            className="w-full border p-2 rounded"
            placeholder="add instruction"
            value={userDescription}
            onChange={(e) => setuserDescription(e.target.value)}
          />

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
                  required
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
              onClick={() => {
                if (
                  !shippingInfo.street &&
                  !shippingInfo.city &&
                  !shippingInfo.state &&
                  !shippingInfo.postalCode &&
                  !shippingInfo.country
                ) {
                  showError("shiping adress is required");
                  return;
                } else {
                  handlePlaceOrder(shippingInfo, userDescription);
                }
              }}
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
