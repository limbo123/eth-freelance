import React, { FC, useEffect, useState } from "react";
import { IChat, IMessage } from "../../models/chat";
import styles from "./Chat.module.css";
import { BiArrowBack, BiSend } from "react-icons/bi";
import { useAppSelector } from "../../hooks/useAppSelector";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { firestore, storage } from "../../firebase";
import shortid from "shortid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { BsFillPlayFill } from "react-icons/bs";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import { IoMdClose } from "react-icons/io";
import { AiOutlineFile } from "react-icons/ai";
import { HiDownload } from "react-icons/hi";
import firebase from "firebase/compat/app";
import moment from "moment";
import sendMessageFn from "../../api/sendMessageFn";

interface ChatProps {
  chat: IChat | undefined;
  closeChat: () => void;
}

const Chat: FC<ChatProps> = ({ chat, closeChat }) => {
  const { user } = useAppSelector((state) => state.authReducer);
  const [message, setMessage] = useState("");
  const [currentVideo, setCurrentVideo] = useState<IMessage>({} as IMessage);

  useEffect(() => {
    if (chat?.chat.messages.lenght > 0) {
      (async () => {
        const newMessages = [...chat?.chat.messages];
        if (
          newMessages[newMessages.length - 1].viewed.includes(user.username)
        ) {
          return;
        }
        newMessages[newMessages.length - 1].viewed.push(user.username);
        await updateDoc(doc(firestore, "chats", chat?.chat.id), {
          messages: newMessages,
        });
      })();
    }
  }, [chat]);

  const getDate = (secs) => {
    const date = new Date(0);
    date.setSeconds(secs);
    // console.log(moment(date));
    return moment(date);
  };

  const sendMessage = async (files: FileList | null) => {
    await sendMessageFn(files, user, message, chat?.chat.id);
    setMessage("");
  };

  const downloadFile = (src: string, name: string) => {
    const a = document.createElement("a");
    a.href = src;
    a.setAttribute("target", "_blank");
    a.setAttribute("download", name);
    a.click();
  };

  const closePlayer = (e: React.SyntheticEvent) => {
    if (e.target === e.currentTarget) {
      setCurrentVideo({} as IMessage);
    }
  };

  const isDatesDifferent = (currDate, prevDate) => {
    return (
      getDate(prevDate.createdAt.seconds).format("MM:DD:YYYY") !==
      getDate(currDate.createdAt.seconds).format("MM:DD:YYYY")
    );
  };

  return (
    <>
      {currentVideo.message && (
        <div className={styles.videoPlayer} onClick={(e) => closePlayer(e)}>
          <button type="button" className={styles.closeVideoBtn}>
            <IoMdClose
              color="#000"
              size={"1.5rem"}
              onClick={() => setCurrentVideo({} as IMessage)}
            />
          </button>
          <VideoPlayer currentVideo={currentVideo} />
        </div>
      )}

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
              {chat?.chat.messages.length > 0 && (
                <p className={styles.date}>
                  {getDate(chat?.chat.messages[0].createdAt.seconds).format(
                    "D MMM YYYY"
                  )}
                </p>
              )}
              {chat?.chat.messages.length > 0 &&
                chat?.chat.messages.map(
                  (message: IMessage, idx: number, arr) => {
                    return (
                      <>
                        {arr[idx - 1] &&
                        isDatesDifferent(message, arr[idx - 1]) ? (
                          <p className={styles.date}>
                            {getDate(message.createdAt.seconds).format(
                              "D MMM YYYY"
                            )}
                          </p>
                        ) : null}
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
                            <a href={message.message} target="_blank">
                              <img
                                className={styles.imageMessage}
                                src={message.message}
                              ></img>
                            </a>
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
                          {message.type.slice(
                            0,
                            message.type.split("").indexOf("/")
                          ) === "application" && (
                            <div
                              className={styles.appMessage}
                              onClick={() =>
                                downloadFile(
                                  message.message,
                                  "file" +
                                    message.type.slice(
                                      message.type.split("").indexOf("/") + 1,
                                      message.type.length
                                    )
                                )
                              }
                            >
                              <HiDownload
                                size={"1.5rem"}
                                style={{ marginRight: 10 }}
                              />
                              <p>
                                file.
                                {message.type.slice(
                                  message.type.split("").indexOf("/") + 1,
                                  message.type.length
                                )}
                              </p>
                            </div>
                          )}

                          <span>
                            {getDate(message.createdAt.seconds).format(
                              "hh:mm A"
                            )}
                          </span>
                        </li>
                      </>
                    );
                  }
                )}
            </ul>
            {chat?.chat?.messages[
              chat.chat.messages.length - 1
            ]?.viewed.includes(chat.guest.username) &&
              chat?.chat.messages[chat.chat.messages.length - 1].author ===
                user.username && <p className={styles.isViewed}>Viewed</p>}
          </div>
          <div className={styles.messageForm}>
            <input
              type="text"
              value={message}
              placeholder="Message..."
              onChange={(e) => setMessage(e.target.value)}
            />
            <div>
              <label htmlFor="send-file">
                <AiOutlineFile color="#8025b1" size={"1.3rem"} />
              </label>
              <input
                type="file"
                id="send-file"
                style={{ display: "none" }}
                onChange={(e) => sendMessage(e.target.files)}
              />
              {message.length > 0 && (
                <button
                  className={styles.sendMsgBtn}
                  onClick={() => sendMessage(null)}
                  type="button"
                >
                  <BiSend color="#8025b1" size={"1.3rem"} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
