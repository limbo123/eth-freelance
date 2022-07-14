import { collection, doc, getDoc } from "firebase/firestore";
import Router from "next/router";
import React, { FC, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import styles from "./Wrapper.module.css";
import Navbar from "../Navbar/Navbar";
import { BsChatLeftText } from "react-icons/bs";
import { animated, useSpring } from "@react-spring/web";
import Chats from "../Chats/Chats";
import { useAppSelector } from "../../hooks/useAppSelector";

const Wrapper = ({ children }) => {
  const { user } = useAppSelector((state) => state.authReducer);
  const [cookies] = useCookies();
  const [isChatsOpened, setIsChatsOpened] = useState(false);

  useEffect(() => {
    if (cookies.user) {
      return;
    }
    Router.push("/");
  }, []);

  const chatStyles = useSpring({
    position: "fixed",
    top: "0",
    right: isChatsOpened ? "0" : "-100vw",
    zIndex: 1
  });

  return (
    <>
      <Navbar />
      {user.address && (
        <animated.div style={{ ...chatStyles } as any}>
          <Chats close={() => setIsChatsOpened(false)}/>
        </animated.div>
      )}
      <button
        type="button"
        style={isChatsOpened ? {display: "none"} : {}}
        onClick={() => setIsChatsOpened(!isChatsOpened)}
        className={styles.chatsBtn}
      >
        <BsChatLeftText color="#fff" size={"1.5rem"} />
      </button>
      {children}
    </>
  );
};

export default Wrapper;
