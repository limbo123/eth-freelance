import {
  DocumentData,
} from "firebase/firestore";
import React, { FC, useEffect, useState } from "react";
import { animated, useSpring } from "react-spring";
import { firestore } from "../../firebase";
import { useAppSelector } from "../../hooks/useAppSelector";
import { IChat } from "../../models/chat";
import Chat from "../Chat/Chat";
import styles from "./Chats.module.css";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { IoMdClose } from "react-icons/io";
import getFullChats from "../../api/getFullChats";

interface ChatsProps {
  close: () => void;
}

const Chats: FC<ChatsProps> = ({ close }) => {
  const { user } = useAppSelector((state) => state.authReducer);
  const [userChats, setUserChats] = useState<IChat[]>([]);
  const [activeChatId, setActiveChatId] = useState("");

  const [chats, loading] = useCollectionData<DocumentData>(
    firestore
      .collection("chats")
      .where("members", "array-contains", user.username) as any
  );

  const chatStyles = useSpring({
    position: "fixed",
    top: "0",
    right: activeChatId ? "0" : "-100vw",
    zIndex: 1,
  });

  useEffect(() => {
    if (!loading) {
      (async () => {
        const fullChats = await getFullChats(chats, user) as IChat[];
        setUserChats(fullChats)
      })();
    }
  }, [loading]);

  useEffect(() => {
    const newChats: any = userChats.map((chat: any) => {
      chat.chat = chats?.find((el) => el.id === chat.chat.id);
      return chat;
    });
    setUserChats(newChats);
  }, [chats]);

  const setChat = (chatId) => {
    setActiveChatId(chatId);
  };

  return (
    <div className={styles.chats}>
      <button onClick={close} className={styles.closeChatsBtn}>
        <IoMdClose size={"1.3rem"} />
      </button>
      <ul className={styles.chatsList}>
        {userChats.map((chat: IChat) => {
          return (
            <li
              className={styles.chatCard}
              key={chat.chat.id}
              onClick={() => setChat(chat.chat.id)}
            >
              <div className={styles.guestInfo}>
                <img src={chat.guest.profilePhoto as any} />
                <p>{chat.guest.username}</p>
              </div>
            </li>
          );
        })}
      </ul>
      <animated.div style={{ ...chatStyles } as any}>
        <Chat
          chat={userChats.find((el) => el.chat.id === activeChatId)}
          closeChat={() => setActiveChatId("")}
        />
      </animated.div>
    </div>
  );
};

export default Chats;
