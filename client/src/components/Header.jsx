import React, { useState,useRef,useEffect } from 'react';
import { NavLink } from 'react-router-dom';
// import r1 from '../assets/r1.png'
import Logo from './Logo'
import {Button}  from '.';

const Header = () => {
    const linkItems = [
        { name: 'Home', link: '/' },
        { name: 'Posts', link: '/posts' },
        { name: 'Profile', link: '/profile' },
    ];

    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    


    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    const mobileMenuRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setMobileMenuOpen(false);
            }
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [mobileMenuRef]);
    return (
        <div className='fixed w-full bg-white shadow-md z-10'>
            <div className='container mx-auto flex justify-between items-center px-4'>
                <div className=' flex items-baseline justify-between w-full'>
                    <div className=''>
                        <Logo />
                    </div>
                    <ul className={`hidden lg:flex space-x-6 ${isMobileMenuOpen ? 'hidden' : ''}`}>
                        {linkItems.map((item) => (
                            <li key={item.name} className='transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300 '>
                                <NavLink
                                    to={item.link}
                                    className={({ isActive }) => `text-black opacity-70 hover:text-emerald-600 ${isActive ? 'text-emerald-600' : ''}`}
                                   // activeClassName='text-emerald-600 opacity-95'
                                >
                                    {item.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                    <div className='flex'>
                        <Button>Sign In</Button>
                        <Button>Sign Up</Button>
                    </div>
                </div>
                {/* Display the mobile menu button on smaller screens */}
                <div className='lg:hidden'>
                    <button className='text-2xl' onClick={toggleMobileMenu}>
                        {isMobileMenuOpen ? '⛌' : '☰'}
                    </button>
                </div>
                {/* Display the mobile menu items vertically when the mobile menu is open */}
                {isMobileMenuOpen && (
                    <div className='lg:hidden absolute top-full left-0 w-full bg-white'>
                        <ul className='flex flex-col p-4 gap-1'>
                            {linkItems.map((item) => (
                                <li key={item.name}>
                                    <NavLink
                                        to={item.link}
                                        className='text-black opacity-50 hover:text-emerald-600 transition duration-300'
                                       // activeClassName='text-emerald-600 opacity-95'
                                        onClick={toggleMobileMenu}
                                    >
                                        {item.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
