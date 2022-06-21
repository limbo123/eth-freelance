import React, { FC, useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { auth, firestore } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { HiLogin } from "react-icons/hi";
import AuthModal from "../AuthModal/AuthModal";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { openAuthModal, setUser, logout } from "../../redux/auth/authSlice";
import { useCookies } from "react-cookie";
import { doc, getDoc } from "firebase/firestore";
import { Skeleton } from "@mui/material";

const Navbar = () => {
  const { isAuthModalOpened, user } = useAppSelector(
    (state) => state.authReducer
  );
  const [cookies, setCookie, removeCookie] = useCookies();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const user = cookies.user;
      if (user) {
        const currentUserRef = doc(firestore, user.type, user.username);
        const userSnap = await getDoc(currentUserRef);
        const currentUser = userSnap.data();
        console.log(currentUser);
        dispatch(setUser(currentUser));
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
    })();
  }, []);

  const logoutUser = () => {
    removeCookie("user");
    dispatch(logout());
  };

  return (
    <>
      <div className={styles.Navbar}>
        <h3 className={styles.Logo}>Go Freelance</h3>
        {isLoading ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Skeleton
              variant="text"
              style={{ marginRight: 10 }}
              width={120}
              height={17}
            />
            <Skeleton variant="circular" width={40} height={40} />
          </div>
        ) : (
          <>
            {Object.keys(user).length > 0 ? (
              <>
                <div className={styles.profileInfo}>
                  <h4>{user.username}</h4>
                  <img src={user.profilePhoto} alt="profile photo" />
                  <button type="button" onClick={logoutUser}>
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => dispatch(openAuthModal())}
                className={styles.LoginBtn}
              >
                <p>Sign up</p>{" "}
                <HiLogin style={{ marginLeft: 7 }} size="1.2rem" />
              </button>
            )}
          </>
        )}
      </div>
      {isAuthModalOpened && <AuthModal register />}
    </>
  );
};

export default Navbar;
