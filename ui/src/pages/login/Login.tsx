import React, { useState } from "react";

import "./login.style.scss";
import Input from "../../components/input";
import Button from "../../components/button";
import { post } from "../../utils/network";
import { setLocalStorageItem } from "../../utils/localStorageUtils";
import { ToastOnSuccess } from "../../utils/toast";

interface iProps {
  setSigninStatus: (flag: boolean) => void;
}

const Login: React.FC<iProps> = ({ setSigninStatus }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response: any = await post("/api/v1/auth/login", {
        email,
        password,
      });
      if (response.data.status === 200) {
        ToastOnSuccess(response.data.message);
        setLocalStorageItem("access_token", response.data.token);
        setLocalStorageItem("userId", response.data.userId);
        setSigninStatus(true);
      }
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
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
          <Button
            label="Login"
            type="submit"
            className="btn-primary login-button"
            onClick={() => {}}
          />
        </form>
      </div>
    </div>
  );
};

export default Login;
