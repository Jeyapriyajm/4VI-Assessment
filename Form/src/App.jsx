import React, { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import default CSS for toastify
import UserHomeScreen from "./pages/UserHomeScreen";
import RentBikeForm from "./components/RentBikeForm";
import RentalDetails from "./pages/rentalDetails";

const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/SignUp"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AppContent = () => {
  const location = useLocation();
  const [hideHeader, setHideHeader] = useState(false);

  useEffect(() => {
    // Check if the current path is in the list of routes to hide the header
    const hideHeaderRoutes = [ "/rent-bike","/homeScreen","/rental-details"];
    setHideHeader(hideHeaderRoutes.includes(location.pathname));
  }, [location]);

  return (
    <>
      {!hideHeader && <Header />}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/homeScreen" element={<UserHomeScreen />} />
          <Route path="/rent-bike" element={<RentBikeForm />} />
          <Route path="/rental-details" element={<RentalDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <ToastContainer 
        position="top-center" 
        autoClose={1000} 
        hideProgressBar={true} 
        closeOnClick 
        theme="colored" 
      />
    </>
  );
};

const App = () => {
  return <AppContent />;
};

export default App;
