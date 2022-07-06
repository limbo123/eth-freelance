import { collection, DocumentData, getDocs, query, where } from "firebase/firestore";
import React, { FC, useEffect, useState } from "react";
import { animated, useSpring } from "react-spring";
import { firestore } from "../../firebase";
import { useAppSelector } from "../../hooks/useAppSelector";
import { IChat } from "../../models/chat";
import { IDeveloper } from "../../models/user";
import Chat from "../Chat/Chat";
import styles from "./Chats.module.css";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { IoMdClose } from "react-icons/io";

interface ChatsProps {
  close: () => void
}

const Chats: FC<ChatsProps> = ({ close }) => {
  // const [isChatOpened, setIsChatOpened] = useState(false);
  const { user } = useAppSelector((state) => state.authReducer);
  const [userChats, setUserChats] = useState<IChat[]>([]);
  const [activeChatId, setActiveChatId] = useState("");
  const [chats, loading] = useCollectionData<DocumentData>(
    firestore
      .collection("chats")
      .where("members", "array-contains", user.username) as any
  );
  console.log(userChats);
  const chatStyles = useSpring({
    position: "fixed",
    top: "0",
    right: activeChatId ? "0" : "-40vw",
  });

  useEffect(() => {
    if (!loading) {
      (async () => {
        const chatsArr: IChat[] = [];
        chats?.forEach(async (chat, idx) => {
          const userSnap = await getDocs(
            query(
              collection(
                firestore,
                user.type === "developers" ? "employers" : "developers"
              ),
              where(
                "username",
                "==",
                chat.members.find(
                  (member: string) => member !== user.username
                )
              )
            )
          );
          chatsArr.push({
            chat,
            guest: userSnap.docs[0].data() as any,
          });
          if (idx === chats.length - 1) {
            setUserChats(chatsArr);
          }
        });
      })();
    }
  }, [loading]);

  useEffect(() => {
    const newChats: any = userChats.map((chat: any) => {
      chat.chat = chats?.find(el => el.id === chat.chat.id);
      return chat;
    })
    setUserChats(newChats);
  }, [chats]);

  const setChat = (chatId) => {
    setActiveChatId(chatId);
  }

  return (
    <div className={styles.chats}>
      <button onClick={close}><IoMdClose size={"1.3rem"}/></button>
      <ul className={styles.chatsList}>
        {userChats.map((chat: IChat) => {
          return (
            <li className={styles.chatCard} key={chat.chat.id} onClick={() => setChat(chat.chat.id)}>
              <div className={styles.guestInfo}>
                <img src={chat.guest.profilePhoto as any} />
                <p>{chat.guest.username}</p>
              </div>
            </li>
          );
        })}
      </ul>
      <animated.div style={{ ...chatStyles } as any}>
        <Chat chat={userChats.find(el => el.chat.id === activeChatId)} closeChat={() => setActiveChatId("")}/>
      </animated.div>
    </div>
  );
};

export default Chats;
