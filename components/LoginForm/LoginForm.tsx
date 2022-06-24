import classNames from "classnames";
import React, { FC, useRef, useState } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import useInputFocus from "../../hooks/useInputFocus";
import { loginUser } from "../../redux/auth/authActions";
import styles from "./LoginForm.module.css";
import formStyles from "../../styles/FormContent.module.css";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/router";

const LoginForm: FC = () => {
  const [passwordInput, setPasswordInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const emailInputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const passwordInputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const isEmailHover = useInputFocus(emailInputRef);
  const isPasswordFocus = useInputFocus(passwordInputRef);
  const dispatch = useAppDispatch();
  const { loading, loginError } = useAppSelector((state) => state.authReducer);
  const router = useRouter();

  const login = async(e: React.SyntheticEvent) => {
    e.preventDefault();
    if (emailInput && passwordInput) {
      await dispatch(loginUser({ email: emailInput, password: passwordInput }));
      router.push("/dashboard");
      return;
    }

    const errorField = document.querySelector(
      "#loginError"
    ) as HTMLHeadingElement;
    errorField.innerHTML = "every field must be filled.";
  };

  const loaderStyles = css`
    display: block;
  `;

  return (
    <>
      <h3 id="loginError" className={formStyles.error}>
        {loginError}
      </h3>
      <div
        className={classNames(
          formStyles.FormContent,
          formStyles.LoginFormContent
        )}
      >
        <label
          style={isEmailHover ? { fontSize: "12px" } : { fontSize: "15px" }}
          htmlFor="login-email-input"
        >
          Email
        </label>
        <input
          required
          ref={emailInputRef}
          type="email"
          id="login-email-input"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          autoComplete="on"
        />

        <label
          style={isPasswordFocus ? { fontSize: "12px" } : { fontSize: "15px" }}
          htmlFor="login-password-input"
        >
          Password
        </label>
        <input
          required
          ref={passwordInputRef}
          type="password"
          id="login-password-input"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          autoComplete="on"
        />
        <button type="submit" onClick={login} className={styles.loginBtn}>
          {loading ? (
            <ClipLoader
              color={"#fff"}
              loading={loading}
              css={loaderStyles}
              size={20}
            />
          ) : (
            <p>Login</p>
          )}
        </button>
      </div>
    </>
  );
};

export default LoginForm;
