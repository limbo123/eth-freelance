import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import React, { FC, useEffect, useState } from "react";
import web3 from "../../ethereum/web3";
import { firestore } from "../../firebase";
import { ITask } from "../../models/task";
import taskObj from "../../ethereum/build/Task.json";
import { IRequest } from "../../models/request";
import { ClipLoader } from "react-spinners";
import { css } from "@emotion/react";
import styles from "./TaskRequestsList.module.css";
import { AiFillMessage } from "react-icons/ai";
import shortid from "shortid";
import { useAppSelector } from "../../hooks/useAppSelector";

interface TaskRequestsListProps {
  task: ITask;
}

const TaskRequestsList: FC<TaskRequestsListProps> = ({ task }) => {
  const { user } = useAppSelector((state) => state.authReducer);
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loaderStyles = css`
    display: block;
  `;

  useEffect(() => {
    setIsLoading(true);
    setRequests([]);
    if (task.requestsKeys.length > 0) {
      (async () => {
        const res: IRequest[] = [];
        const taskContract = await new web3.eth.Contract(
          taskObj.abi,
          task.address
        );
        const devsCollection = collection(firestore, "developers");
        task.requestsKeys.map(async (address, idx) => {
          const accQuery = query(
            devsCollection,
            where("address", "==", address)
          );
          const accQueryDocs = await getDocs(accQuery);
          if (accQueryDocs.docs.length === 1) {
            accQueryDocs.forEach(async (doc) => {
              const request: IRequest = {} as IRequest;
              request.author = doc.data();
              const reqBody = await taskContract.methods
                .requests(address)
                .call();
              request.body = reqBody;
              console.log(request);
              res.push(request);
              setRequests(res);
              setIsLoading(false);
            });
          }
        });
      })();
    } else {
      setIsLoading(false);
    }
  }, [task]);

  const createChat = async (request: IRequest) => {
    console.log(request);
    const chatsCollection = collection(firestore, "chats");
    const chatId = shortid.generate();
    await setDoc(doc(chatsCollection, chatId), {
      id: chatId,
      members: [user.username, request.author.username],
      messages: [],
      taskAddress: task.address
    });
  };

  if (isLoading) {
    return (
      <ClipLoader
        color={"#000"}
        loading={isLoading}
        css={loaderStyles}
        size={20}
      />
    );
  }

  return (
    <>
      {requests.length > 0 ? (
        <div>
          <ul className={styles.requests}>
            {requests.map((req) => {
              return (
                <li key={req.author.address}>
                  {+task.worker === 0 ?<button
                    className={styles.respondReqBtn}
                    onClick={() => createChat(req)}
                  >
                    Respond <AiFillMessage style={{ marginLeft: 10 }} />
                  </button> : <p style={{ position: "absolute", right: 20 }}>Task is already in progress</p>}
                  
                  <div className={styles.authorInfo}>
                    <img src={req.author.profilePhoto} />
                    <div>
                      <p>{req.author.username}</p>
                      <p className={styles.rating}>
                        Rating: {req.author.rating}
                      </p>
                    </div>
                  </div>
                  <div className={styles.requestBody}>
                    {req.body.description}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <h3>No requests yet</h3>
      )}
    </>
  );
};

export default TaskRequestsList;
