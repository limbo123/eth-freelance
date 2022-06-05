import React, { FC, useRef, useState } from "react";
import formStyles from "../../styles/FormContent.module.css";
import useInputFocus from "../../hooks/useInputFocus";

const RegisterForm: FC = () => {
  const [passwordInput, setPasswordInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const emailInputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const passwordInputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const isEmailHover = useInputFocus(emailInputRef)
  const isPasswordFocus = useInputFocus(passwordInputRef);


  return (
    <div className={formStyles.FormContent}>
      <label style={isEmailHover ? {fontSize: "12px"} : {fontSize: "15px"}} htmlFor="register-email-input">
        Email
      </label>
      <input
      ref={emailInputRef}
        type="email"
        id="register-email-input"
        value={emailInput}
        onChange={(e) => setEmailInput(e.target.value)}
        autoComplete="on"
      />

      <label style={isPasswordFocus ? {fontSize: "12px"} : {fontSize: "15px"}} htmlFor="register-password-input">
        Password
      </label>
      <input
      ref={passwordInputRef}

        type="password"
        id="register-password-input"
        value={passwordInput}
        onChange={(e) => setPasswordInput(e.target.value)}
        autoComplete="on"
      />
    </div>
  );
};

export default RegisterForm;
