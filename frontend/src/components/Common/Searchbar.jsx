import React, { useState } from 'react'
import { HiMagnifyingGlass, HiMiniXMark } from 'react-icons/hi2';
import { useDispatch } from 'react-redux';
import {useNavigate} from 'react-router-dom'
import { fetchProductsByFilters } from '../../redux/slices/productsSlice';
import { setFilters } from '../../redux/slices/productsSlice';


const Searchbar = () => {
    const [searchTerm, setSerchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSearchToggle = () => {
        setIsOpen(!isOpen);
    }

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim() !== "") {
            dispatch(setFilters({search : searchTerm}));
            dispatch(fetchProductsByFilters({search : searchTerm}));
            navigate(`/collections/all?search=${searchTerm}`);
            setIsOpen(false);
        }
    }

  return (
    <div className={`flex items-center justify-center w-full transition-all duration-300 ${isOpen ? "absolute top-0 left-0 w-full bg-white h-24 z-50"
     : "w-auto"}`}>
       {isOpen ? (
        <form className='flex relative items-center justify-center w-full' onSubmit={handleSearch}>
            <div className='relative w-1/2'>
                <input type="text" placeholder='Search' value={searchTerm}
                className='bg-gray-100 px-4 py-2 pl-2 pr-12 rounded-lg focus:outline-none w-full'
                onChange={(e) => setSerchTerm(e.target.value)}/>

                <button type='submit'
                 className='absolute right-2 top-1/2 text-gray-600 hover:text-gray-800 transform -translate-y-1/2 cursor-pointer'>
                    <HiMagnifyingGlass className='h-6 w-6'/>
                </button>
            </div>
                <button onClick={handleSearchToggle}
                    className='absolute right-3 top-1/2 text-gray-600 hover:text-gray-800 transform -translate-y-1/2 cursor-pointer'
                >
                    <HiMiniXMark className='h-6 w-6'/>
                </button>
        </form>
    ) : (
        <button onClick={handleSearchToggle} className='cursor-pointer'>
            <HiMagnifyingGlass className='h-6 w-6'/>
        </button>
       )}
    </div>
  )
}

export default Searchbar
