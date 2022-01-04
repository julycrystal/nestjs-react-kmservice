import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom';
import { useMediaQuery } from "react-responsive";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { RootState } from '../app/store';
import { removeToken } from '../features/auth/services/localstorage.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';

const NavBar = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const cart = useSelector((state: RootState) => state.cart);
    const [open, setOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);

    const isDesktop = useMediaQuery({
        query: '(min-width: 1024px)'
    });

    useEffect(() => {
        if (!user && openDropdown) {
            setOpenDropdown(false);
        }
    }, [user, openDropdown])

    const logoutHandler = () => {
        removeToken();
        dispatch(logout())
    }

    const Dropdown = () => {
        return <>
            <div className="relative inline-block text-left z-10">
                <div>
                    <button onClick={() => setOpenDropdown(!openDropdown)} type="button" className="inline-flex justify-center w-full px-0 lg:px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none">
                        {user && user.name}
                        <svg className="-mr-1 lg:ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                {openDropdown && <div className={`origin-top-right absolute ${isDesktop ? 'right-0' : 'left-0'} mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}>
                    <div className="py-1" role="none">
                        <Link onClick={() => setOpenDropdown(false)} to="/profile" className="text-gray-700 block px-4 py-2 text-sm">Profile</Link>
                        <button onClick={logoutHandler} className="text-gray-700 block w-full text-left px-4 py-2 text-sm">
                            Sign out
                        </button>
                    </div>
                </div>}
            </div>
        </>
    }

    return (
        <div className="py-4 shadow-xl">
            <div className="hidden lg:flex items-center justify-between px-4 ">
                <div className="hidden lg:flex items-center">
                    <div className="">
                        <ul className="flex space-x-6 cursor-pointer">
                            <li className="py-2">
                                <Link to="/" className={"text-xl font-bold"}>KM Commerce</Link>
                            </li>
                            <li className="py-2">
                                <NavLink className={({ isActive }) => isActive ? "text-blue-500" : ` hover:text-blue-500`} to="/">Home</NavLink>
                            </li>
                            <li className="py-2">
                                <NavLink className={({ isActive }) => isActive ? "text-blue-500" : ` hover:text-blue-500`} to="/products">Products</NavLink>
                            </li>
                            <li className="py-2">
                                <NavLink className={({ isActive }) => isActive ? "text-blue-500" : ` hover:text-blue-500`} to="/about">About</NavLink>
                            </li>
                            <li className="py-2">
                                <NavLink className={({ isActive }) => isActive ? "text-blue-500" : ` hover:text-blue-500`} to="/contact">Contact</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="hidden lg:flex items-center">
                    <Link to="/cart" className="relative">
                        <FontAwesomeIcon icon={faCartPlus} />
                        <div className="absolute -top-3 -right-2 text-xs bg-red-500 text-white font-bold rounded-lg px-1 pt-0.5">
                            <p>{cart.items?.length}</p>
                        </div>
                    </Link>
                    <div className="text-sm font-bold">
                        {user?.name ? <Dropdown /> : <>  <NavLink className={({ isActive }) => isActive ? "text-blue-500" : ""} to="/auth/login">
                            Login
                        </NavLink>
                            <span className='mx-3'>/</span>
                            <NavLink className={({ isActive }) => isActive ? "text-blue-500" : ""} to="/auth/register">
                                Register
                            </NavLink></>}
                    </div>
                </div>
            </div>

            {/* small screen */}

            <div className={`lg:hidden flex justify-between items-center px-3`}>
                <h3 className="font-extrabold text-2xl tracking-widest">
                    <Link to="/">
                        KM Commerce
                    </Link>
                </h3>
                <button className="outline-none mobile-menu-button" onClick={() => setOpen(!open)}>
                    <svg className=" w-6 h-6 text-gray-500 hover:text-gray-500 "
                        x-show="!showMenu"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </div>

            {(open && !isDesktop) && <div className="">
                <ul className="mt-4">
                    <li className=""><Link to="/" className="block text-sm px-2 py-4 hover:text-black">Home</Link></li>
                    <li><Link to="/about" className="block text-sm px-2 py-4  hover:text-black">About</Link></li>
                    <li><Link to="/contact" className="block text-sm px-2 py-4 hover:text-black hover:font-bold">Contact</Link></li>
                    <li className="px-2 py-4 text-sm">
                        {user?.name ? <Dropdown /> :
                            <>
                                <Link to="/auth/login">
                                    Login
                                </Link>
                                <span className='mx-3'>/</span>
                                <Link to="/auth/register">
                                    Register
                                </Link>
                            </>
                        }
                    </li>
                </ul>
            </div>
            }
        </div>
    )
}

export default NavBar;