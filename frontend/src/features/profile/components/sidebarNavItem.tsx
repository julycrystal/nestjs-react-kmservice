import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink, useLocation } from 'react-router-dom';

interface ISidebarNavItem {
    icon: any;
    title: string;
    url: string;
}

export default function SidebarNavItem ({ icon, title, url }: ISidebarNavItem) {
    const location = useLocation();
    const active = (location.pathname === url);
    return (
        <NavLink to={url}>
            <div className={`text-gray-500 px-4 py-4 cursor-pointer border-l-4 border-gray-100 ${active && "border-blue-400"} hover:border-blue-400 hover:bg-white hover:text-blue-400`}>
                <div className="flex ml-4 items-center">
                    <FontAwesomeIcon icon={icon} size="sm" className="" />
                    <p className='ml-4 text-sm'>{title}</p>
                </div>
            </div>
        </NavLink>
    )
}
