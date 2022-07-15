import React, { FC, useState } from "react";
import LoginForm from "../LoginForm/LoginForm";
import RegisterForm from "../RegisterForm/RegisterForm";
import styles from "./AuthModal.module.css";
import { animated, useSpring } from "@react-spring/web";
import { closeAuthModal } from "../../../redux/auth/authSlice"
import { useAppDispatch } from "../../../hooks/useAppDispatch";

interface AuthModalProps {
  register: boolean;
}

const AuthModal: FC<AuthModalProps> = ({ register }) => {
  const dispatch = useAppDispatch();
  const [isRegistration, setIsRegistration] = useState(register);

  const loginStyles = useSpring({
    marginLeft: isRegistration ? -1000 : 0,
  });

  const registerStyles = useSpring({
    marginLeft: isRegistration ? 0 : 1000,
    marginTop: -180,
  });

  const closeModal = (e: React.SyntheticEvent) => {
    if (e.target === e.currentTarget) {
      dispatch(closeAuthModal())
    }
  };
  return (
    <div className={styles.Overlay} onClick={closeModal}>
      <div className={styles.Modal} style={!isRegistration ? {height: "350px"} : {}}>
      <h3 className={styles.FormLogo}>Go Freelance</h3>
      <ul className={styles.FormNav}>
        <li style={!isRegistration ? {borderBottom: "3px solid var(--root-color)"} : undefined} onClick={() => setIsRegistration(false)}>Login</li>
        <li style={isRegistration ? {borderBottom: "3px solid var(--root-color)"}: undefined} onClick={() => setIsRegistration(true)}>Register</li>
      </ul>
        <animated.form
          id="loginForm"
          style={{
            ...loginStyles, 
          }}
        >
          <LoginForm />
        </animated.form>
        <animated.form
          id="registerForm"
          style={{
            ...registerStyles,
          }}
        >
          <RegisterForm />
        </animated.form>
      </div>
    </div>
  );
};

export default AuthModal;
