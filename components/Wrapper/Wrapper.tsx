import { collection, doc, getDoc } from "firebase/firestore";
import React, { FC, useEffect } from "react";
import { useCookies } from "react-cookie";
import { firestore } from "../../firebase";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setUser } from "../../redux/auth/authSlice";

// interface WrapperProps {
//   children?: React.ReactNode;
// }

const Wrapper = ({ children }) => {
  
  return <>{children}</>;
};

export default Wrapper;
