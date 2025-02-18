import React from "react";
import { useSearchParams } from "react-router-dom";

const SortOptions = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const handleSortChange = (e) => {
        searchParams.set("sortBy", e.target.value);
        setSearchParams(searchParams);
    }

  return (
    <div className="mb-4 flex items-center justify-end">
      <select
        name=""
        id="sort"
        className="border p-2 rounded-md focus:outline-none"
        value={searchParams.get("sortBy") || ""}
        onChange={handleSortChange}
      >
        <option value="">Default</option>
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
        <option value="popularity">Popularity</option>
      </select>
    </div>
  );
};

export default SortOptions;
