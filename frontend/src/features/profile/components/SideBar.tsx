import { faCaretUp, faCaretDown, faAlignJustify, faChartBar, faReply, faUserCog, faUserEdit, faLock, faBoxes, faBox, faHeart, faAddressCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { logout } from "../../auth/authSlice";
import { removeToken } from "../../auth/services/localstorage.service";
import SidebarNavItem from "./sidebarNavItem";
import UserInfo from "./UserInfo";

export default function Sidebar () {

    const [showNav, setShowNav] = useState(true);
    const isDesktop = useMediaQuery({
        query: '(min-width: 1024px)'
    });

    const dispatch = useDispatch();

    useEffect(() => {
        if (!isDesktop && showNav) {
            setShowNav(false);
        } else if (isDesktop) {
            setShowNav(true);
        }
    }, [isDesktop])

    const logoutHandler = () => {
        removeToken();
        dispatch(logout())
    }

    return (
        <>
            <div className="bg-white shadow-lg mb-5 lg:shadow-none">
                <UserInfo />
            </div>
            <div onClick={() => setShowNav(!showNav)} className="bg-white py-3 px-3 shadow-lg text-gray-500 font-bold items-center justify-between cursor-pointer flex lg:hidden">
                <p>Navigations</p>
                <FontAwesomeIcon icon={showNav ? faCaretUp : faCaretDown} />
            </div>
            <div className={`${showNav ? "block" : "hidden"} flex-col lg:space-y-2 shadow-md`}>
                <div className="bg-gray-100 lg:mt-2 shadow-lg">
                    <SidebarNavItem url="/profile" icon={faChartBar} title={"Dashboard"} />
                    <SidebarNavItem url="/profile/orders" icon={faBox} title={"Your Orders"} />
                    <SidebarNavItem url="/profile/favourites" icon={faHeart} title={"Favourites"} />
                </div>
                <div className="bg-gray-100 lg:mt-2 shadow-lg">
                    <SidebarNavItem url="/profile/edit-profile" icon={faUserEdit} title={"Edit Profile"} />
                    <SidebarNavItem url="/profile/myaddresses" icon={faAddressCard} title={"Addresses"} />
                    <SidebarNavItem url="/profile/change-password" icon={faLock} title={"Change Password"} />
                    <SidebarNavItem url="/profile/account" icon={faUserCog} title={"Account"} />
                </div>
                <div className="bg-gray-100 lg:mt-2 shadow-lg" onClick={logoutHandler}>
                    <SidebarNavItem url="/" icon={faReply} title={"Log Out"} />
                </div>
            </div>
        </>
    )
}