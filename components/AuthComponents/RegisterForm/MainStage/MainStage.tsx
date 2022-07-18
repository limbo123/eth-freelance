import React, { FC, useRef } from "react";
import styles from "./MainStage.module.css";
import formStyles from "../../../../styles/FormContent.module.css";
import defaultLogo from "../../../../assets/images/defaultAvatar.jpg";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import useInputFocus from "../../../../hooks/useInputFocus";
import { ClipLoader } from "react-spinners";
import { css } from "@emotion/react";
import { CountryDropdown } from "react-country-region-selector";

interface MainStageProps {
  changeImage: (arg: any) => void;
  emailInput: string;
  setEmailInput: (arg: string) => void;
  passwordInput: string;
  setPasswordInput: (arg: string) => void;
  nicknameInput: string;
  setNicknameInput: (arg: string) => void;
  addressInput: string;
  setAddressInput: (arg: string) => void;
  countryInput: string;
  setCountryInput: (arg: string) => void;
  register: (arg: React.SyntheticEvent) => void;
}

const MainStage: FC<MainStageProps> = ({
  changeImage,
  emailInput,
  setEmailInput,
  passwordInput,
  setPasswordInput,
  nicknameInput,
  setNicknameInput,
  addressInput,
  setAddressInput,
  countryInput,
  setCountryInput,
  register,
}) => {
  const { loading, registerError } = useAppSelector(
    (state) => state.authReducer
  );

  const loaderStyles = css`
    display: block;
    background: #000;
  `;

  const hideVerification = () => {
    const verification = document.querySelector(
      "#verification"
    ) as HTMLDivElement;
    verification.style.display = "none";
  };

  const focusOnAddressInput = () => {
    hideVerification();
    setAddressInput("");
    addressInputRef.current.focus();
  };

  const emailInputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const passwordInputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const nicknameInputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const countryInputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const addressInputRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const isAddressFocus = useInputFocus(addressInputRef);
  const isCountryFocus = useInputFocus(countryInputRef);
  const isNicknameFocus = useInputFocus(nicknameInputRef);
  const isEmailFocus = useInputFocus(emailInputRef);
  const isPasswordFocus = useInputFocus(passwordInputRef);
  return (
    <div className={formStyles.FormContent}>
      <div className={styles.profilePhoto}>
        <label className={styles.changeImageLabel} htmlFor="changeProfilePhoto">
          <img
            id="profileImage"
            className={styles.ProfileImg}
            src={defaultLogo.src}
            alt=""
          />
          <p>Click on image to change it</p>
        </label>
        <input
          required
          style={{ display: "none" }}
          onChange={changeImage}
          type="file"
          accept="image/*"
          id="changeProfilePhoto"
        />
      </div>

      <h3 id="registerError" className={formStyles.error}>
        {registerError}
      </h3>

      <div className={formStyles.inputSection}>
        <div>
          <label
            style={isEmailFocus ? { fontSize: "12px" } : { fontSize: "15px" }}
            htmlFor="register-email-input"
          >
            Email
          </label>
          <input
            required
            ref={emailInputRef}
            type="email"
            id="register-email-input"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            autoComplete="on"
          />

          <label
            style={
              isPasswordFocus ? { fontSize: "12px" } : { fontSize: "15px" }
            }
            htmlFor="register-password-input"
          >
            Password
          </label>
          <input
            required
            ref={passwordInputRef}
            type="password"
            id="register-password-input"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            autoComplete="on"
          />
        </div>

        <div>
          <label
            style={
              isNicknameFocus ? { fontSize: "12px" } : { fontSize: "15px" }
            }
            htmlFor="register-nickname-input"
          >
            Nickname
          </label>
          <input
            required
            ref={nicknameInputRef}
            type="text"
            id="register-nickname-input"
            value={nicknameInput}
            onChange={(e) => setNicknameInput(e.target.value)}
            autoComplete="on"
          />

          <label
            style={isAddressFocus ? { fontSize: "12px" } : { fontSize: "15px" }}
            htmlFor="register-address-input"
          >
            Metamask address
          </label>
          <input
            required
            ref={addressInputRef}
            type="address"
            id="register-address-input"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            autoComplete="on"
          />
          <div id="verification" className={styles.addressVerification}>
            <p>Is that your address?</p>
            <div>
              <button
                type="button"
                className={styles.verificationBtnYes}
                onClick={hideVerification}
              >
                Yes
              </button>
              <button
                type="button"
                className={styles.verificationBtnNo}
                onClick={focusOnAddressInput}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>

      <label
        style={isCountryFocus ? { fontSize: "12px" } : { fontSize: "15px" }}
      >
        Country
      </label>
      <div className={styles.countrySelect}>
        <CountryDropdown
          value={countryInput}
          onChange={(val) => setCountryInput(val)}
          // style={{ height: 30, marginBottom: 20 }}
        />
      </div>

      <button type="submit" onClick={register} className={styles.registerBtn}>
        {loading ? (
          <ClipLoader
            color={"#fff"}
            loading={loading}
            css={loaderStyles}
            size={20}
          />
        ) : (
          <p>Register</p>
        )}
      </button>
    </div>
  );
};

export default MainStage;
