import React from 'react'
import { IoLogoInstagram } from 'react-icons/io'
import { RiTwitterXLine } from 'react-icons/ri'
import { TbBrandMeta } from 'react-icons/tb'
import {FiPhoneCall} from 'react-icons/fi'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='border-t py-12'>
        <div className='container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-3 lg:px-0'>
            <div>
                <h3 className='text-lg text-gray-800 mb-4'>Newsletter</h3>
                <p className='text-gray-500 mb-4'>Be the first to hear about new offers, exclusive events, and online offers</p>
                <p className='font-medium text-sm text-gray-600 mb-6'>Signup and get 10% off on your first order</p>

                {/* Newsletter form  */}
                <form className='flex' >
                    <input type="email" placeholder="Enter your email"
                     className="w-full p-3 text-sm border-t border-l border-b border-gray-300 rounded-l-md focus:outline-none focus:ring-2
                     focus:ring-gray-500 transition-all" required/>
                     <button type="submit" className='bg-black text-white px-4 py-3 text-sm rounded-r-md hover:bg-gray-800 transition-all cursor-pointer'>Subscribe</button>
                </form>
            </div>

            {/* Shopping List  */}
            <div>
                <h3 className='text-lg mb-4 text-gray-800'>Shop</h3>
                <ul className='space-y-2 text-gray-600'>
                    <li>
                        <Link to={'#'} className='hover:text-gray-500 transition-colors'>Men&apos;s Top Wear</Link>
                    </li>
                    <li>
                        <Link to={'#'} className='hover:text-gray-500 transition-colors'>Women&apos;s Top Wear</Link>
                    </li>
                    <li>
                        <Link to={'#'} className='hover:text-gray-500 transition-colors'>Men&apos;s Bottom Wear</Link>
                    </li>
                    <li>
                        <Link to={'#'} className='hover:text-gray-500 transition-colors'>Kid&apos;s Wear</Link>
                    </li>
                </ul>
            </div>

            {/* About Us  */}
            <div>
                <h3 className='text-lg mb-4 text-gray-800'>Shop</h3>
                <ul className='space-y-2 text-gray-600'>
                    <li>
                        <Link to={'#'} className='hover:text-gray-500 transition-colors'>About us</Link>
                    </li>
                    <li>
                        <Link to={'#'} className='hover:text-gray-500 transition-colors'>Contact us</Link>
                    </li>
                    <li>
                        <Link to={'#'} className='hover:text-gray-500 transition-colors'>FAQs</Link>
                    </li>
                    <li>
                        <Link to={'#'} className='hover:text-gray-500 transition-colors'>Features</Link>
                    </li>
                </ul>
            </div>

            {/* Follow us */}
            <div>
                <h3 className='text-lg text-gray-800 mb-4'>Follow us</h3>
                <div className='flex items-center space-x-4 mb-6'>
                    <a href="https://www.facebook.com" target='_blank' rel='noopener noreferrer' className='hover:text-gray-500'><TbBrandMeta className='h-5 w-5'/></a>
                    <a href="https://www.facebook.com" target='_blank' rel='noopener noreferrer' className='hover:text-gray-500'><IoLogoInstagram className='h-5 w-5'/></a>
                    <a href="https://www.facebook.com" target='_blank' rel='noopener noreferrer' className='hover:text-gray-500'><RiTwitterXLine className='h-5 w-5'/></a>
                </div>
                <p className='text-gray-600'>Call Us</p>
                <p><FiPhoneCall className='inline-block mr-2'/>+91 0254 793 15</p>
            </div>
        </div>

        {/* Footer Bottom */}
        <div className="container mx-auto mt-12 border-t border-gray-200 px-4 lg:px-0 pt-6">
            <p className='tracking-tighter text-sm text-gray-500 text-center'>@ 2025, CrazyTiger. All Rights Reserved</p>
        </div>
    </footer>
  )
}

export default Footer
