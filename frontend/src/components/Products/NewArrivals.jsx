import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollLeft, setScrollLeft] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const [newArrivals, setNewArrivals] = useState([]);
  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`);
        // console.log(response.data);
        if (Array.isArray(response.data.newArrivals)) {
          setNewArrivals(response.data.newArrivals);
        } else {
          setNewArrivals([]); // Ensure it's an array to avoid `.map()` error
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchNewArrivals();
  }, [])
  
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    // setCanScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newX = e.pageX - scrollRef.current.offsetLeft;
    // scrollRef.current.scrollLeft = scrollLeft - (newX - startX);
    scrollRef.current.scrollLeft -= newX - startX;
    setStartX(newX);
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const scroll = (directions) => {
    const scrollAmount = directions === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  //updating scroll buttons
  const updateScrollButtons = () => {
    const container = scrollRef.current;

    if (container) {
      const leftScroll = container.scrollLeft;
      const rightScroll =
        container.scrollWidth > container.scrollLeft + container.clientWidth;
      setCanScrollLeft(leftScroll > 0);
      setCanScrollRight(rightScroll);
    }

    // console.log({
    //   scrollLeft: container.scrollLeft,
    //   clientWidth: container.clientWidth,
    //   containerScrollWidth: container.scrollWidth,
    // });
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
      return () => container.removeEventListener("scroll", updateScrollButtons);
    }
  }, [newArrivals]);

  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto mb-10 text-center relative">
        <h2 className="text-3xl font-bold mb-4">Explore new Arrivals</h2>
        <p className="text-lg text-gray-600 mb-8">
          Discover the latest style straight of the runway, freshly added to
          keep your wardrobe on the cutting edge of fashion
        </p>

        {/* Scroll buttons */}
        <div className="absolute right-0 space-x-2 flex bottom-[-30px]">
          <button
            className={`p-2 rounded border ${
              canScrollLeft
                ? "text-black cursor-pointer bg-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            } `}
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
          >
            <FiChevronLeft className="text-2xl" />
          </button>
          <button
            className={`p-2 rounded border ${
              canScrollRight
                ? "text-black cursor-pointer bg-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            } `}
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
          >
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Scrollable contents */}
      <div
        ref={scrollRef}
        className={`flex container mx-auto overflow-x-scroll space-x-6 relative ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        {newArrivals.map((product) => (
          <div
            key={product._id}
            className="min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative"
          >
            <img
              src={product.images[0]?.url}
              alt={product.images[0]?.altText}
              className="w-full h-[500px] rounded-lg object-cover"
              draggable="false"
            />
            <div className="absolute bottom-0 left-0 right-0 backdrop-blur-md text-white p-4 rounded-b-lg">
              <Link to={`/product/${product._id}`} className="block">
                <h4 className="font-medium">{product.name}</h4>
                <p className="mt-1">${product.price}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;
