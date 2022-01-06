import { Navigate, Route, Routes } from "react-router"
import Order from "./Order";
import Users from "./users";
import Products from "./Products";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import { UserRole } from "../../../../__generated__/globalTypes";

const Admin = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    if (user && user.role === UserRole.User) {
        return <Navigate to="/404" replace={true} />
    }
    return (
        <Routes>
            <Route path="orders/*" element={<Order />} />
            <Route path="users/*" element={<Users />} />
            <Route path="products/*" element={<Products />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
    )
}

export default Admin
