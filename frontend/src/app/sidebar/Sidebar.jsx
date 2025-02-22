import React, { useState, useEffect } from 'react';
import { 
  IoIosHome, 
  IoIosHeart, 
  IoMdTime, 
  IoMdApps, 
  IoIosPeople, 
  IoIosHelpCircle, 
  IoIosSettings 
} from 'react-icons/io';
import { useSelector } from 'react-redux';

import { NavLink , Link} from 'react-router-dom';

const Sidebar = () => {
 
  const items = [
    {
      name: 'Home',
      link: '/',
      icon: <IoIosHome />,
    },
    {
      name: 'Liked Videos',
      link: '/liked-videos',
      icon: <IoIosHeart />,
    },
    {
      name: 'History',
      link: '/history',
      icon: <IoMdTime />,
    },
    {
      name: 'My Content',
      link: '/my-content',
      icon: <IoMdApps />,
    },
    {
      name: 'Collections',
      link: '/collections',
      icon: <IoMdApps />,
    },
    {
      name: 'Subscribers',
      link: '/subscribers',
      icon: <IoIosPeople />,
    },
  ];

  const isMenuOpen = useSelector(state => state.toggle.isMenuOpen)

  if(!isMenuOpen){
    return null
  }

  return (
  
    <div className={`'bg-black text-white h-full  flex-col hidden md:flex border border-y-0 border-l-0 transorm transition-all duration-400'`}>
      <ul className='flex-grow px-2 py-3'>
        {items.map((item, index) => (
          <NavLink 
          className={({isActive}) => `${isActive? "text-purple-400" : "text-gray-200"}`}
          to={item.link} key={index}>
          <li
            className='py-2 px-5 hover:bg-purple-400 
             transform transition-all duration-100
            hover:text-black w-[100%] mb-4 cursor-pointer 
            flex items-center border rounded-sm'
          >
            {item.icon && <span className='mr-2'>{item.icon}</span>}
            {item.name}
          </li>
          </NavLink>
        ))}
      </ul>
      <ul className='px-2'>
        <li className='py-2 px-4 hover:bg-purple-400 hover:text-black  cursor-pointer flex items-center w-[15vw] mb-4 border'>
          <span className='mr-2'><IoIosHelpCircle /></span> Support
        </li>
        <li className='py-2 px-4 hover:bg-purple-400 hover:text-black  cursor-pointer flex items-center w-[15vw] mb-4 border'>
          <span className='mr-2'><IoIosSettings /></span> Setting
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
