import Navbar from "../components/navbar/Navbar";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
import Login from "../pages/login/Login";
import Registration from "../pages/singup/Registration";
import Profile from "../pages/profile/Profile";
import { useState } from "react";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import { ROUTE_NAME } from "../utils/constant";

function Routeway() {
  const [isVerified, setVerified] = useState(
    !!localStorage.getItem("access_token") ? true : false
  );
  const navigate = useNavigate();

  const setSigninStatus = (status: boolean) => {
    setVerified(status);
    if (status) {
      navigate(ROUTE_NAME.DASHBOARD);
    }
  };

  return (
    <div>
      <Navbar isVerified={isVerified} />
      <Routes>
        <Route path="/" element={<Navigate to={ROUTE_NAME.DASHBOARD} />} />

        <Route
          path={ROUTE_NAME.DASHBOARD}
          element={
            <ProtectedRoute
              isVerified={isVerified}
              redirectPath={ROUTE_NAME.LOGIN}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTE_NAME.LOGIN}
          element={
            <PublicRoute
              isVerified={isVerified}
              redirectPath={ROUTE_NAME.DASHBOARD}
            >
              <Login setSigninStatus={setSigninStatus} />
            </PublicRoute>
          }
        />
        <Route
          path={ROUTE_NAME.REGISTER}
          element={
            <PublicRoute
              isVerified={isVerified}
              redirectPath={ROUTE_NAME.DASHBOARD}
            >
              <Registration />
            </PublicRoute>
          }
        />
        <Route
          path={ROUTE_NAME.PROFILE}
          element={
            <ProtectedRoute
              isVerified={isVerified}
              redirectPath={ROUTE_NAME.LOGIN}
            >
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<>hello</>} />
      </Routes>
    </div>
  );
}

export default Routeway;
