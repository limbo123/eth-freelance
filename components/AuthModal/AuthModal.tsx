import React, { FC, useState } from "react";
import LoginForm from "../LoginForm/LoginForm";
import RegisterForm from "../RegisterForm/RegisterForm";
import styles from "./AuthModal.module.css";
import { animated, useSpring } from "react-spring";

interface AuthModalProps {
  closeAuthModal: () => void;
}

const AuthModal: FC<AuthModalProps> = ({ closeAuthModal }) => {
  const [isRegistration, setIsRegistration] = useState(false);

  const loginStyles = useSpring({
    marginLeft: isRegistration ? -1000 : 0,
  });

  const registerStyles = useSpring({
    marginLeft: isRegistration ? 0 : 1000,
    marginTop: -94
  });

  const closeModal = (e: React.SyntheticEvent) => {
    if (e.target === e.currentTarget) {
      closeAuthModal();
    }
  };
  return (
    <div className={styles.Overlay} onClick={closeModal}>
      <div className={styles.Modal}>
      <h3 className={styles.FormLogo}>Go Freelance</h3>
      <ul className={styles.FormNav}>
        <li style={!isRegistration ? {borderBottom: "4px solid #10ab0b"} : undefined} onClick={() => setIsRegistration(false)}>Login</li>
        <li style={isRegistration ? {borderBottom: "4px solid #10ab0b"}: undefined} onClick={() => setIsRegistration(true)}>Register</li>
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
