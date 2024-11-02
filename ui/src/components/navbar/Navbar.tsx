import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./navbar.style.scss";
import Avtar from "../../assets/avatar.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { get } from "../../utils/network";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "../../utils/localStorageUtils";
import { setProfileUrl } from "../../redux/slices/profileSlice";
interface iProps {
  isVerified: boolean;
  imgUrl?: string;
}

const Navbar: React.FC<iProps> = ({ isVerified }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const profileUrl = useSelector((state: any) => state.profile.profileUrl);
  const access_token = getLocalStorageItem("access_token");
  const dispatch = useDispatch();

  const fetchProfile = async () => {
    if (access_token) {
      try {
        const response: any = await get("/api/v1/user/profile", access_token);
        const { data, status } = response.data;
        if (status === 200) {
          dispatch(setProfileUrl(data.profilePicture || ""));
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    }
  };

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    document.body.classList.toggle("dark-mode", newIsDarkMode);
    setLocalStorageItem("isDarkMode", newIsDarkMode);
  };

  const getNavLinkClass = (path: string) => {
    return location.pathname === path ? "nav-link active" : "nav-link";
  };

  useEffect(() => {
    fetchProfile();

    const storedTheme = getLocalStorageItem("isDarkMode");
    console.log("storedTheme", storedTheme);
    setIsDarkMode(storedTheme);
    document.body.classList.toggle("dark-mode", storedTheme);
  }, []);

  return (
    <nav
      className={`navbar navbar-expand-lg p-2 ${
        isDarkMode ? "navbar-dark" : "navbar-light"
      }`}
    >
      <Link className="navbar-brand" to="/">
        Ai Gen
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        onClick={toggleNavbar}
        aria-controls="navbarNavAltMarkup"
        aria-expanded={!isCollapsed ? "true" : "false"}
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div
        className={`${isCollapsed ? "collapse" : ""} navbar-collapse`}
        id="navbarNavAltMarkup"
      >
        <ul className="navbar-nav ms-auto">
          {isVerified && (
            <>
              <li className="nav-item">
                <Link className={getNavLinkClass("/dashboard")} to="/dashboard">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item m-0">
                <Link className={getNavLinkClass("/profile")} to="/profile">
                  <img
                    className="avtar-img"
                    src={profileUrl?.length ? profileUrl : Avtar}
                    alt="avtar"
                  />
                </Link>
              </li>
            </>
          )}

          {!isVerified && (
            <>
              <li className="nav-item">
                <Link className={getNavLinkClass("/register")} to="/register">
                  Register
                </Link>
              </li>
              <li className="nav-item">
                <Link className={getNavLinkClass("/login")} to="/login">
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>
        <label className="switch">
          <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
          <span className="slider"></span>
        </label>
      </div>
    </nav>
  );
};

export default Navbar;
