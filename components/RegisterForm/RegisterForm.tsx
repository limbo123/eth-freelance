import React, { FC, useEffect, useRef, useState } from "react";

import { IDeveloper, IEmployer } from "../../models/user";
import web3 from "../../ethereum/web3";
import countries from "../../countries.json";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { registerUser } from "../../redux/auth/authActions";
import TypeChoosingStage from "./TypeChoosingStage/TypeChoosingStage";
import MainStage from "./MainStage/MainStage";
import axios from "axios";
import SphereChoosing from "./SphereChoosing/SphereChoosing";
import { useRouter } from "next/router";

const RegisterForm: FC = () => {
  const [stage, setStage] = useState(0);
  const [accountType, setAccountType] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [nicknameInput, setNicknameInput] = useState("");
  const [aboutInput, setAboutInput] = useState("");
  const [addressInput, setAddressInput] = useState("");
  const [currentPhoto, setCurrentPhoto] = useState<File>({} as File);
  const [countryInput, setCountryInput] = useState("");
  const [sphereInput, setSphereInput] = useState("Choose your sphere");
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const accounts = await web3.eth.getAccounts();
      setAddressInput(accounts[0]);
      const ipRequest = await axios.get(
        "https://ipinfo.io/json?token=c035a2c577d1cd"
      );
      const countryFullNameReq = countries[ipRequest.data.country];
      setCountryInput(countryFullNameReq);
    })();
  }, []);

  const goToNextStep = () => {
    if (accountType === "") {
      return;
    }
    setStage(stage + 1);
  };

  const changeImage = (e: React.SyntheticEvent) => {
    const input = e.target as HTMLInputElement;
    const files = input.files as FileList;
    const imageUrl = URL.createObjectURL(files[0]);
    setCurrentPhoto(files[0]);
    const image = document.querySelector("#profileImage") as HTMLImageElement;
    image.src = imageUrl;
  };

  const register = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    // const emailValidation = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // if(emailInput.match(emailValidation)) {
    //   console.log("email is valid");
    // } else {
    //   console.log("email is invalid");
    // }

    
    if (
      emailInput &&
      nicknameInput &&
      addressInput &&
      passwordInput &&
      currentPhoto
    ) {
      const userObj = {
        address: addressInput,
        description: aboutInput,
        email: emailInput,
        password: passwordInput,
        profilePhoto: currentPhoto,
        rating: 0,
        username: nicknameInput,
        type: accountType,
        sphere: sphereInput,
      };
      let userByType: IEmployer | IDeveloper;
      if(accountType === "developers") {
        userByType = {...userObj, completedTasks: []}
      } else {
        userByType = {...userObj, createdTasks: [], moneysSpent: 0}
      }
      await dispatch(registerUser(userByType));
      router.push("/dashboard");
      return;
    }

    const errorField = document.querySelector(
      "#registerError"
    ) as HTMLHeadingElement;
    errorField.innerHTML =
      "every field must be filled. Don't forget to choose avatar";
  };

  return (
    <>
      {stage === 0 && (
        <TypeChoosingStage
          accountType={accountType}
          setAccountType={setAccountType}
          goToNextStep={goToNextStep}
        />
      )}
      {stage === 1 && (
        <SphereChoosing
          goToNextStep={goToNextStep}
          setSphere={setSphereInput}
          sphere={sphereInput}
        />
      )}

      {stage === 2 && (
        <MainStage
          emailInput={emailInput}
          setEmailInput={setEmailInput}
          addressInput={addressInput}
          setAddressInput={setAddressInput}
          nicknameInput={nicknameInput}
          setNicknameInput={setNicknameInput}
          countryInput={countryInput}
          setCountryInput={setCountryInput}
          changeImage={changeImage}
          passwordInput={passwordInput}
          setPasswordInput={setPasswordInput}
          register={register}
        />
      )}
    </>
  );
};

export default RegisterForm;
