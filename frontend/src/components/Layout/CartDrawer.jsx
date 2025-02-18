import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import CartContents from "../Cart/CartContents";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CartDrawer = ({ drawerOpen, toggleDrawer }) => {
  const navigate = useNavigate();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const userId = user ? user._id : null;
  const handleCheckout = () => {
    toggleDrawer();
    if (!user) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
  };
  const fg = guestId ? guestId : cart?.cart?.guestId;
  // console.log(fg);

  return (
    <div
      className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-white shadow-lg transform transition-transform duration-300
    flex flex-col z-50 ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="flex justify-end p-4">
        {/* Close Button */}
        <button onClick={toggleDrawer}>
          <IoMdClose className="h-6 w-6 text-gray-600 cursor-pointer" />
        </button>
      </div>

      {/* Cart Content with scrollable area */}
      <div className="grow p-4 overflow-y-auto">
        <h2 className="font-semibold text-xl mb-4">Your Cart</h2>
        {/* Cart Content Components */}
        {cart && cart?.cart?.products?.length > 0 ? (
          <CartContents cart={cart?.cart} userId={userId} guestId={fg} />
        ) : (
          <p>Your cart is empty..</p>
        )}
      </div>

      {/* Checkout button  */}
      <div className="p-4 bg-white sticky bottom-0">
        {cart && cart?.cart?.products?.length > 0 && (
          <>
            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold cursor-pointer hover:bg-gray-800 transition"
            >
              {" "}
              Checkout
            </button>
            <p className="text-sm tracking-tighter text-gray-500 text-center mt-2">
              Shipping, taxes and discount codes calculated at checkout
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
