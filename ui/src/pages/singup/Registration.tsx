import React, { useState } from "react";
import Input from "../../components/input";
import Button from "../../components/button";
import "./registration.style.scss";
import { post } from "../../utils/network";
import { ToastOnFailure, ToastOnSuccess } from "../../utils/toast";
import { useNavigate } from "react-router-dom";
import { ROUTE_NAME } from "../../utils/constant";

const Registration: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response: any = await post("/api/v1/auth/register", {
        name,
        username: userName,
        email,
        password,
      });
      if (response.data.status === 200) {
        ToastOnSuccess(response.data.message);
        navigate(ROUTE_NAME.LOGIN);
      }
    } catch (err: any) {
      ToastOnFailure(err.response.data.message);
    }
  };

  return (
    <div className="registration-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <Input
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button
          label="Register"
          type="submit"
          className="reg-btn"
          onClick={() => console.log("Register clicked")}
        />
      </form>
    </div>
  );
};

export default Registration;
