import React from 'react'
import {TbBrandMeta} from 'react-icons/tb'
import {IoLogoInstagram} from 'react-icons/io'
import {RiTwitterXLine} from 'react-icons/ri'

const Topbar = () => {
  return (
    <div className='text-white bg-[#ea2e0e]'>
      <div className='container mx-auto flex items-center justify-between py-3 px-4'>
        <div className='hidden md:flex items-center space-x-4'>
            <a href="#" className='hover:text-gray-300'><TbBrandMeta className='h-5 w-5'/></a>
            <a href="#" className='hover:text-gray-300'><IoLogoInstagram className='h-5 w-5'/></a>
            <a href="#" className='hover:text-gray-300'><RiTwitterXLine className='h-4 w-4'/></a>
        </div>
        <div className="text-sm text-center grow">
            <span>We ship worldwide - Fast and Reliable</span>
        </div>
        <div className="text-sm hidden md:block">
            <a href="tel:+91025479315" className='hover:text-gray-300'> +91 0254 793 15</a>
        </div>
      </div>
    </div>
  )
}

export default Topbar
