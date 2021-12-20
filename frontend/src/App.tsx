import { gql, useLazyQuery, useQuery } from "@apollo/client";
// import { PRODUCT_LIST } from './graphql/product.graphql';
import { Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { Footer, Navbar } from "./components";
import { Home } from "./features/home/containers";
import { Login, Register } from "./features/auth/containers";
import { getToken } from "./features/auth/services/localstorage.service";
import { Spinner } from "./shared/loader";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { MY_PROFILE } from "./features/auth/graphql/auth.graphql";
import { login } from "./features/auth/authSlice";

function App () {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const token = getToken();

  const [fetchProfileData] = useLazyQuery(
    MY_PROFILE,
    {
      fetchPolicy: "no-cache",
      onCompleted: ({ myProfile }) => {
        if (myProfile.ok) {
          dispatch(login({ user: myProfile.user }));
        }
        setLoading(false);
      },
      onError: () => {
        setLoading(false);
      }
    }
  );

  if (token && !enabled) {
    setLoading(true);
    setEnabled(true);
    fetchProfileData();
  }

  if (loading) {
    return (<div className="h-screen flex items-center justify-center">
      <Spinner height={40} color={"#000"} />
    </div>);
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="bg-gray-200 flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/products" element={<Products />} /> */}
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
