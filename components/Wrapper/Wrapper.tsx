import { collection, doc, getDoc } from "firebase/firestore";
import Router from "next/router";
import React, { FC, useEffect } from "react";
import { useCookies } from "react-cookie";
import { start } from "repl";
import { firestore } from "../../firebase";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { setUser } from "../../redux/auth/authSlice";
import Navbar from "../Navbar/Navbar";

// interface WrapperProps {
//   children?: React.ReactNode;
// }

const Wrapper = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies();
  // const { startLoading } = useAppSelector(state => state.authReducer);

  useEffect(() => {
    if(cookies.user) {
      return;
    }
    Router.push("/");
  }, []);

  // if(startLoading) {
  //   return <h1>Is Loading...</h1>
  // }

  
  return <>
  <Navbar />
  {children}
  </>;
};

export default Wrapper;
