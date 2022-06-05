import React, { FC, useState } from "react";
import styles from "./Navbar.module.css";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { HiLogin } from "react-icons/hi";
import AuthModal from "../AuthModal/AuthModal";

const Navbar = () => {
  const [user] = useAuthState(auth);
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <div className={styles.Navbar}>
        <h3 className={styles.Logo}>Go Freelance</h3>
        {user ? (
          <button className={styles.LogoutBtn}>Logout</button>
        ) : (
          <button
            onClick={() => setIsModalVisible(true)}
            className={styles.LoginBtn}
          >
            Login <HiLogin style={{ marginLeft: 7 }} size="1.2rem" />
          </button>
        )}
      </div>
      {isModalVisible && (
        <AuthModal closeAuthModal={() => setIsModalVisible(false)} />
      )} 
    </>
  );
};

export default Navbar;
