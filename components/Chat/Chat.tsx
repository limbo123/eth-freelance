import React, { FC, useEffect, useMemo, useState } from "react";
import { IChat, IMessage } from "../../models/chat";
import styles from "./Chat.module.css";
import { BiArrowBack, BiSend } from "react-icons/bi";
import { useAppSelector } from "../../hooks/useAppSelector";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../firebase";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import { IoMdClose } from "react-icons/io";
import { AiOutlineFile } from "react-icons/ai";
import moment from "moment";
import sendMessageFn from "../../api/sendMessageFn";
import taskJson from "../../ethereum/build/Task.json";
import web3 from "../../ethereum/web3";
import Link from "next/link";
import ChatMessage from "../ChatMessage/ChatMessage";

interface ChatProps {
  chat: IChat | undefined;
  closeChat: () => void;
}

const Chat: FC<ChatProps> = ({ chat, closeChat }) => {
  const { user } = useAppSelector((state) => state.authReducer);
  const [message, setMessage] = useState("");
  const [currentVideo, setCurrentVideo] = useState<IMessage>({} as IMessage);
  const [taskContract, setTaskContract] = useState<any>({});
  const [taskAddress, setTaskAddress] = useState("");
  const [taskInfo, setTaskInfo] = useState("");

  const guestImgUrl = useMemo(() => chat?.guest.profilePhoto, [chat?.guest.profilePhoto]);

  useEffect(() => {
    (async () => {
      if (chat?.chat) {
        const contract = await new web3.eth.Contract(
          taskJson.abi,
          chat?.chat.taskAddress
        );
        setTaskContract(contract);
        const info = await contract.methods.getInfo().call();
        setTaskAddress(contract.options.address);
        setTaskInfo(info);
      }

      if (chat?.chat.messages.lenght > 0) {
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
      }
    })();
  }, [chat]);

  const getDate = (secs) => {
    const date = new Date(0);
    date.setSeconds(secs);
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

  const startWork = async () => {
    await taskContract.methods
      .startTask(chat?.guest.address)
      .send({ from: user.address });
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
              src={guestImgUrl as string}
              className={styles.guestAvatar}
              alt=""
            />
            <p>{chat?.guest.username}</p>
          </div>

          <div className={styles.chatTask}>
            <Link href={`dashboard/?task_address=${taskAddress}`}>
              <p>"{taskInfo["1"]}" task</p>
            </Link>
            {user.type === "employers" && +taskInfo["5"] === 0 && (
              <button type="button" onClick={startWork}>
                Start work with {chat?.guest.username}
              </button>
            )}
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
                      <ChatMessage
                        arr={arr}
                        idx={idx}
                        message={message}
                        getDate={getDate}
                        isDatesDifferent={isDatesDifferent}
                        user={user}
                        downloadFile={downloadFile}
                        setCurrentVideo={setCurrentVideo}
                      />
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
