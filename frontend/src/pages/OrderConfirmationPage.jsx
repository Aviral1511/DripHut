import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const naviagte = useNavigate();
  const {checkout} = useSelector((state) => state.checkout);

  //clear cart when order is confirmed
  useEffect(() => {
    if(checkout &&checkout._id){
      dispatch(clearCart());
      localStorage.removeItem("cart");
    } else {
      naviagte('/my-orders');
    }
  },[naviagte, dispatch,checkout])

  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Thank You for Your Order!
      </h1>

      {checkout && (
        <div className="p-6 rounded-lg border">
          <div className="flex justify-between mb-20">
            {/* Order Id and Date */}
            <div>
              <h2 className="text-xl font-semibold">Order # {checkout._id}</h2>
              <p className="text-gray-600 text-sm">
                Order date : {new Date(checkout.createdAt).toLocaleString()}
              </p>
            </div>
            {/* Estimated Delivery Date */}
            <div>
              <p>
                Estimated Delivery :{" "}
                {calculateEstimatedDelivery(checkout.createdAt)}
              </p>
            </div>
          </div>
          {/* Ordered Items */}
          <div className="mb-20">
            {checkout.checkoutItems.map((items) => (
              <div key={items.productId} className="flex items-center mb-4">
                <img
                  src={items.image}
                  alt={items.name}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div>
                    <h4 className="text-md font-semibold">{items.name}</h4>
                    <p className="text-sm text-gray-500">{items.color} | {items.size}</p>
                </div>
                <div className="ml-auto text-right">
                    <p className="text-md">${items.price}</p>
                    <p className="text-sm text-gray-500">Qty : {items.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Payment and delivery info */}
          <div className="grid grid-cols-2 gap-8">
            {/* Payment info */}
            <div>
                <h4 className="text-lg font-semibold mb-2">Payment</h4>
                <p className="text-gray-600">PayPal</p>
            </div>

            {/* Delivery info */}
            <div>
                <h4 className="text-lg font-semibold mb-2">Delivery</h4>
                <p className="text-gray-600">{checkout.shippingAddress.address}</p>
                <p className="text-gray-600">{checkout.shippingAddress.city}, {" "} {checkout.shippingAddress.country}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
