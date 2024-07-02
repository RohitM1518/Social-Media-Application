import React, { useState,useRef,useEffect } from 'react';
import { NavLink } from 'react-router-dom';
// import r1 from '../assets/r1.png'
import Logo from './Logo'
import {Button}  from '.';
import { useSelector,useDispatch } from 'react-redux';
import axios from 'axios';
import { logout } from '../redux/useSlice';
import { errorParser } from '../utils/errorParser';
import { useResponseContext } from '../contexts/ResponseContext';
import { useErrorContext } from '../contexts/ErrorContext';
import { useLoadingContext } from '../contexts/LoadingContext';


const Header = () => {
    const user = useSelector(state => state?.user?.currentUser)
    const accessToken = useSelector(state => state?.user?.accessToken)
    // console.log(user)
    const backendURL = import.meta.env.VITE_BACKEND_URL
    const {setResponse}=useResponseContext()
    const {setError}= useErrorContext()
    const [linkItems,setLinkItems]=useState([])
    const dispatch = useDispatch()
    const {setIsLoading}=useLoadingContext()
    useEffect(()=>{
        if(user){
            const temp = [
                { name: 'Home', link: '/' },
                { name: 'Posts', link: '/posts' },
                { name: 'Profile', link: `/profile/${user._id}` },
            ];
            setLinkItems(temp)
        }
    },[user])
    

    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    


    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    const mobileMenuRef = useRef(null);

    const handleLogout =async()=>{
        try {
            setIsLoading(true)
            const res=await axios.delete(`${backendURL}/user/`,{
                withCredentials:true,
                headers:{
                    'Authorization':`Bearer ${accessToken}`
                }
            })
            setResponse(res.data.message)
            dispatch(logout())
        } catch (error) {
            const errorMsg = errorParser(error)
            console.log(error)
            setError(errorMsg)
        }
        finally{
            setIsLoading(false)
        }
    }
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
            <div className=' container mx-auto flex justify-between items-center px-4 max-lg:py-4'>
                <div className=' flex items-baseline justify-between w-full'>
                    <div className=' sm:flex sm:justify-center sm:items-center'>
                        <Logo />
                    </div>
                    <div className={`hidden lg:flex space-x-6 py-4 ${isMobileMenuOpen ? 'hidden' : ''}`}>
                        {linkItems.map((item) => (
                            <div key={item.name} className='transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300 '>
                                <NavLink
                                    to={item.link}
                                    className={({ isActive }) => `text-black opacity-70 font-mono hover:text-emerald-600 ${isActive ? 'text-emerald-600' : ''}`}
                                   // activeClassName='text-emerald-600 opacity-95'
                                >
                                    {item.name}
                                </NavLink>
                            </div>
                        ))}
                    </div>
                    {!user && <div className='flex max-lg:hidden'>
                        <Button url='/signin' style='bg-white text-black border-black border'>Sign In</Button>
                        <Button url='/signup'>Sign Up</Button>
                    </div>}
                    {
                        user && <div onClick={handleLogout}  className=' max-lg:hidden'>
                            {/* <h4 className=' font-mono font-bold'>{user?.username}</h4>
                             */}
                             <Button style=' bg-white text-black border-black border'>Logout</Button>
                        </div>
                    }
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
                                        className='text-black font-mono opacity-50 hover:text-emerald-600 transition duration-300'
                                       // activeClassName='text-emerald-600 opacity-95'
                                        onClick={toggleMobileMenu}
                                    >
                                        {item.name}
                                    </NavLink>
                                </li>
                            ))}
                          {!user &&  <div className='flex'>
                        <Button url='/signin' style='bg-white text-black border-black border'>Sign In</Button>
                        <Button url='/signup'>Sign Up</Button>
                    </div>}
                    {
                        user && <div onClick={handleLogout}>
                            <Button style=' bg-white text-black border-black border'>Logout</Button>
                        </div>
                    }
                        </ul>
                        
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
