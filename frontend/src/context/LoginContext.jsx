import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api.js";
import { useToast } from "./ToastContext.jsx";

const LoginContext = createContext();

export const useLogin = () => {
  return useContext(LoginContext);
};

export const LoginProvider = ({ children }) => {
  const { showSuccess, showError } = useToast();
  const [userId, setUserId] = useState("");
  const [islogedin, setIslogedin] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profilepic, setProfilepic] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  const checkLoggedin = async () => {
    try {
      const response = await api.get("/user/checkAuth");

      if (!response.data.isLoggedIn) {
        setIslogedin(false);
        setUserId("");
        setEmail("");
        setRole("");
        setName("");
        setAddress("");
        setPhone("");
        setProfilepic("");
        setCreatedAt("");
        setUpdatedAt("");
        return;
      }

      setUserId(response.data.userId);
      setEmail(response.data.email);
      setRole(response.data.role);
      setIslogedin(response.data.isLoggedIn);
      setName(response.data.name);
      setAddress(response.data.address);
      setPhone(response.data.phone);
      setProfilepic(response.data.profilepic);
      setCreatedAt(response.data.createdAt);
      setUpdatedAt(response.data.updatedAt);
    } catch (error) {
      console.log(error);
      setIslogedin(false);
    }
  };

  const handlelogOut = async () => {
    if (islogedin && window.confirm("Are you sure you want to logout?")) {
      try {
        let response = await api.post("/user/logout");
        showSuccess(response.data.message);
      } catch (error) {
        console.log("Error in logout:", error);
        showError(error.response.data.error || "Error in logout");
      }
    }
  };

  useEffect(() => {
    checkLoggedin();
  }, []);

  return (
    <LoginContext.Provider
      value={{
        islogedin,
        userId,
        role,
        email,
        name,
        phone,
        address,
        profilepic,
        createdAt,
        updatedAt,
        setIslogedin,
        setEmail,
        handlelogOut,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
