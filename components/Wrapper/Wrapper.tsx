import { collection, doc, getDoc } from "firebase/firestore";
import Router from "next/router";
import React, { FC, useEffect } from "react";
import { useCookies } from "react-cookie";
import { firestore } from "../../firebase";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setUser } from "../../redux/auth/authSlice";
import Navbar from "../Navbar/Navbar";

// interface WrapperProps {
//   children?: React.ReactNode;
// }

const Wrapper = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies();

  useEffect(() => {
    if(cookies.user) {
      return;
    }
    Router.push("/");
  }, [])

  
  return <>
  <Navbar />
  {children}
  </>;
};

export default Wrapper;
