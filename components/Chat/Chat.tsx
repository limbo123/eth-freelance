import React, { FC, useEffect, useState } from "react";
import { IChat } from "../../models/chat";
import styles from "./Chat.module.css";
import { BiArrowBack } from "react-icons/bi";
import { useAppSelector } from "../../hooks/useAppSelector";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../firebase";
import shortid from "shortid";

interface ChatProps {
  chat: IChat | undefined;
  closeChat: () => void;
}

const Chat: FC<ChatProps> = ({ chat, closeChat }) => {
  const { user } = useAppSelector((state) => state.authReducer);
  const [message, setMessage] = useState("");
  // const [file, setFile] = useState<File>({} as File);
  useEffect(() => {
    if(chat?.chat) {
      (async() => {
        const newMessages = [...chat.chat.messages];
        if(newMessages[newMessages.length - 1].viewed.includes(user.username)) {
          return;
        }
        // console.log(newMessages);
        // console.log(chat.chat.messages);
        newMessages[newMessages.length - 1].viewed.push(user.username);
        await updateDoc(doc(firestore, "chats", chat.chat.id), {
          messages: newMessages
        })
      })()
  }
  }, [chat]);

  const sendMessage = (file: FileList | null) => {
    if(chat?.chat) {
      const chatDoc = doc(firestore, "chats", chat.chat.id);
    if(file) {
      console.log("file choosed");
      return;
    }

    updateDoc(chatDoc, {
      messages: arrayUnion({
        author: user.username,
        type: "text",
        message,
        viewed: [user.username]
      })
    })

    }
  }

  return (
    <>
      {user.address && (
        <div className={styles.chat}>
          <div className={styles.topPanel}>
            <button
              type="button"
              className={styles.closeChatBtn}
              onClick={closeChat}
            >
              <BiArrowBack size={"1.5rem"} />
            </button>
            <img
              src={chat?.guest.profilePhoto as any}
              className={styles.guestAvatar}
              alt=""
            />
            <p>{chat?.guest.username}</p>
          </div>
          <div className={styles.chatSection}>
            <ul>
              {chat?.chat.messages.map((message: any) => {
                return (
                  <li
                    style={message.author === user.username ? {marginLeft: "auto", background: "#8707e8", color: "#fff"} : {background: "#d5aef2"}}
                    className={styles.message}
                  >
                    {message.message}
                  </li>
                );
              })}
            </ul>
            {chat?.chat.messages[chat.chat.messages.length - 1].viewed.includes(chat.guest.username) && chat?.chat.messages[chat.chat.messages.length - 1].author === user.username && <p className={styles.isViewed}>Viewed</p>}
          </div>
          <div className={styles.messageForm}>
              <input type="text" value={message} onChange={e => setMessage(e.target.value)} />
              <label htmlFor="send-file"></label>
              <input type="file" id="send-file" onChange={(e) => sendMessage(e.target.files)}/>
              <button onClick={() => sendMessage(null)} type="button">Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
