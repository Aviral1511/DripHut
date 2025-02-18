import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
} from "react-icons/hi2";
import Searchbar from "./Searchbar.jsx";
import CartDrawer from "../Layout/CartDrawer.jsx";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const { cart } = useSelector((store) => store.cart);
  const { user } = useSelector((store) => store.auth);

  const cartItemCount =
    cart?.cart?.products?.reduce(
      (total, product) => total + product.quantity,
      0
    ) || 0;

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };
  return (
    <>
      <nav className="container mx-auto flex justify-between items-center py-4 px-6">
        <div>
          <Link to={"/"} className="text-2xl font-medium">
            DripHut
          </Link>
        </div>
        <div className="hidden md:flex space-x-6">
          <Link
            to={"/collections/all?gender=Men"}
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Men
          </Link>
          <Link
            to={"/collections/all?gender=Women"}
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Women
          </Link>
          <Link
            to={"/collections/all?category=Top Wear"}
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Top Wear
          </Link>
          <Link
            to={"/collections/all?category=Bottom Wear"}
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Bottom Wear
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {user && user.role === "admin" && (
            <Link
              to={`/admin`}
              className="block bg-black px-2 rounded-md text-sm text-white"
            >
              Admin
            </Link>
          )}

          <Link to={"/profile"} className="hover:text-black">
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>
          <button className="relative hover:text-black" onClick={toggleDrawer}>
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700 cursor-pointer" />
            {cartItemCount > 0 && (
              <span className="absolute -top-0.5 text-white bg-[#ea2e0e] text-xs rounded-full px-2 py-0.5">
                {cartItemCount}
              </span>
            )}
          </button>
          {/* Search Bar  */}
          <div className="overflow-hidden">
            <Searchbar />
          </div>
          <button
            className="md:hidden cursor-pointer"
            onClick={toggleNavDrawer}
          >
            <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </nav>
      {/* Cart Drawer  */}
      <CartDrawer drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />
      {/* Mobile Navigation  */}
      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform
                duration-300 z-50 ${
                  navDrawerOpen ? "translate-x-0" : "-translate-x-full"
                }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-600 cursor-pointer" />
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav className="space-y-4">
            <Link
              to={"/collections/all?gender=Men"}
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Men
            </Link>
            <Link
              to={"/collections/all?gender=Women"}
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Women
            </Link>
            <Link
              to={"/collections/all?category=Top Wear"}
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Top Wear
            </Link>
            <Link
              to={"/collections/all?category=Bottom Wear"}
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Bottom Wear
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
