import { Route, Routes } from "react-router";
import { Login } from "./Login";
import { Register } from "./Register";

export { Login } from "./Login";
export { Register } from "./Register";

export default function Auth () {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    )
}
