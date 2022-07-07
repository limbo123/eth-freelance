import React, { FC, useEffect, useState } from "react";
import { IChat, IMessage } from "../../models/chat";
import styles from "./Chat.module.css";
import { BiArrowBack } from "react-icons/bi";
import { useAppSelector } from "../../hooks/useAppSelector";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { firestore, storage } from "../../firebase";
import shortid from "shortid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { BsFillPlayFill } from "react-icons/bs";
import videojs from "video.js";
import VideoPlayer from "../VideoPlayer/VideoPlayer";

interface ChatProps {
  chat: IChat | undefined;
  closeChat: () => void;
}

const Chat: FC<ChatProps> = ({ chat, closeChat }) => {
  const { user } = useAppSelector((state) => state.authReducer);
  const [message, setMessage] = useState("");
  const [currentVideo, setCurrentVideo] = useState<IMessage>({} as IMessage);
  // const [file, setFile] = useState<File>({} as File);
  useEffect(() => {
    if (chat?.chat) {
      (async () => {
        const newMessages = [...chat.chat.messages];
        if (
          newMessages[newMessages.length - 1].viewed.includes(user.username)
        ) {
          return;
        }
        // console.log(newMessages);
        // console.log(chat.chat.messages);
        newMessages[newMessages.length - 1].viewed.push(user.username);
        await updateDoc(doc(firestore, "chats", chat.chat.id), {
          messages: newMessages,
        });
      })();
    }
  }, [chat]);

  const sendMessage = (files: FileList | null) => {
    if (chat?.chat) {
      const chatDoc = doc(firestore, "chats", chat.chat.id);
      if (files) {
        const imageRef = ref(
          storage,
          `chatFiles/${files[0].name}${shortid.generate()}`
        );
        uploadBytes(imageRef, files[0]).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            updateDoc(chatDoc, {
              messages: arrayUnion({
                author: user.username,
                type: files[0].type,
                message: url,
                viewed: [user.username],
              }),
            });
          });
        });
        // console.log(files[0]);
        return;
      }

      updateDoc(chatDoc, {
        messages: arrayUnion({
          author: user.username,
          type: "text",
          message,
          viewed: [user.username],
        }),
      });
    }
  };

  return (
    <>
      {currentVideo.message && <div className={styles.videoPlayer}>
        <VideoPlayer currentVideo={currentVideo} />
        </div>}
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
              {chat?.chat.messages.map((message: IMessage) => {
                return (
                  <li
                    style={
                      message.author === user.username
                        ? {
                            marginLeft: "auto",
                            background: "#8707e8",
                            color: "#fff",
                          }
                        : { background: "#d5aef2" }
                    }
                    className={styles.message}
                  >
                    {message.type === "text" && message.message}

                    {message.type.slice(
                      0,
                      message.type.split("").indexOf("/")
                    ) === "image" && (
                      <img
                        className={styles.imageMessage}
                        src={message.message}
                      ></img>
                    )}
                    {message.type.slice(
                      0,
                      message.type.split("").indexOf("/")
                    ) === "video" && (
                      <div
                        className={styles.videoMessage}
                        onClick={() => setCurrentVideo(message)}
                      >
                        <BsFillPlayFill
                          className={styles.videoPlayIcon}
                          size="5rem"
                          color="#fff"
                        />
                        <video src={message.message}></video>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
            {chat?.chat.messages[chat.chat.messages.length - 1].viewed.includes(
              chat.guest.username
            ) &&
              chat?.chat.messages[chat.chat.messages.length - 1].author ===
                user.username && <p className={styles.isViewed}>Viewed</p>}
          </div>
          <div className={styles.messageForm}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <label htmlFor="send-file"></label>
            <input
              type="file"
              id="send-file"
              onChange={(e) => sendMessage(e.target.files)}
            />
            <button onClick={() => sendMessage(null)} type="button">
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
