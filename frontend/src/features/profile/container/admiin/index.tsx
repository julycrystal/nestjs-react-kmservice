import { Navigate, Route, Routes } from "react-router"
import Order from "./Order";
import Users from "./users";
import Products from "./Products";

const Admin = () => {
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
