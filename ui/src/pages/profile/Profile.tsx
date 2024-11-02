import React, { useEffect, useState } from "react";
import "./profile.style.scss";
import Input from "../../components/input";
import Button from "../../components/button";
import { get, post, put, recordActivity } from "../../utils/network";
import { getLocalStorageItem } from "../../utils/localStorageUtils";
import { ToastOnSuccess } from "../../utils/toast";
import Loader from "../../components/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { setProfileUrl } from "../../redux/slices/profileSlice";

const Profile: React.FC = () => {
  const [username, setUsername] = useState("User Name");
  const [email, setEmail] = useState("user@example.com");
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(false);
  const userId = getLocalStorageItem("userId");
  const access_token = getLocalStorageItem("access_token");
  const dispatch = useDispatch();
  const profileUrl = useSelector((state: any) => state.profile.profileUrl);

  const profileUpdate = async () => {
    setLoading(true);
    try {
      const response: any = await put(
        "/api/v1/user/profile",
        {
          username,
          email,
        },
        getLocalStorageItem("access_token")
      );
      if (response.data.status === 200) {
        recordActivity(
          userId,
          `Profile is uploaded successfully`,
          access_token
        );
        ToastOnSuccess(response.data.message);
      }
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response: any = await get("/api/v1/user/profile", access_token);
      const { data, status } = response.data;
      if (status === 200) {
        setUsername(data.username);
        setEmail(data.email);
        setProfileImage(data.profilePicture);
        dispatch(setProfileUrl(data.profilePicture || ""));
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await recordActivity(userId, `User logout successfully`, access_token);
      localStorage.removeItem("access_token");
      localStorage.removeItem("userId");
      window.location.href = "/login";
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1048576) {
        alert(
          "Image size should not exceed 1MB. Please choose a smaller file."
        );
        return;
      }

      const formData = new FormData();
      formData.append("profilePicture", file);
      setLoading(true);
      try {
        const response = await post(
          "/api/v1/user/profile/upload",
          formData,
          access_token
        );
        recordActivity(
          userId,
          `Profile picture uploaded successfully`,
          access_token
        );
        console.log("Image uploaded successfully:", response.data);
        const url = URL.createObjectURL(file);
        dispatch(setProfileUrl(url));
        setProfileImage(url);
      } catch (error) {
        console.error("Failed to upload image", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <Loader />;
  }

  console.log("url", profileUrl);

  return (
    <div className="profile-container glassmorphism">
      <Button className="logout-btn" label="Logout" onClick={logout} />
      <h2>Profile</h2>
      <div className="profile-image">
        {profileImage || profileUrl ? (
          <img src={profileImage || profileUrl} alt="Profile" />
        ) : (
          <div className="placeholder">No Image</div>
        )}
        <input
          type="file"
          onChange={handleImageChange}
          className="file-input"
        />
      </div>
      <div className="profile-details">
        <Input
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="profile-actions">
        <Button label="Save Changes" onClick={() => profileUpdate()} />
      </div>
    </div>
  );
};

export default Profile;
