import React, { FC, memo } from "react";
import { IMessage } from "../../../models/chat";
import { IDeveloper, IEmployer } from "../../../models/user";
import styles from "./ChatMessage.module.css";
import {BsFillPlayFill} from "@react-icons/all-files/bs/BsFillPlayFill";
import {HiDownload} from "@react-icons/all-files/hi/HiDownload";
import isDatesdifferent from "../../../utils/isDatesdifferent";
import getDate from "../../../utils/getDate";




interface ChatMessageProps {
  message: IMessage;
  idx: number;
  arr: any;
  user: IDeveloper | IEmployer;
  setCurrentVideo: (message: IMessage) => void;
  downloadFile: (src: string, name: string) => void;
}

const ChatMessage: FC<ChatMessageProps> = 
  ({
    message,
    idx,
    arr,
    user,
    setCurrentVideo,
    downloadFile,
  }) => {
    return (
      <>
        {arr[idx - 1] && isDatesdifferent(message, arr[idx - 1]) ? (
          <p className={styles.date}>
            {getDate(message.createdAt.seconds).format("D MMM YYYY")}
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

          {message.type.slice(0, message.type.split("").indexOf("/")) ===
            "image" && (
            <a href={message.message} target="_blank" rel="noreferrer">
              <img className={styles.imageMessage} src={message.message}></img>
            </a>
          )}
          {message.type.slice(0, message.type.split("").indexOf("/")) ===
            "video" && (
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
          {message.type.slice(0, message.type.split("").indexOf("/")) ===
            "application" && (
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
              <HiDownload size={"1.5rem"} style={{ marginRight: 10 }} />
              <p>
                file.
                {message.type.slice(
                  message.type.split("").indexOf("/") + 1,
                  message.type.length
                )}
              </p>
            </div>
          )}

          <span>{getDate(message.createdAt.seconds).format("hh:mm A")}</span>
        </li>
      </>
    );
  }
;

export default ChatMessage;
