import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { userInfo } from "os";
import React, { FC, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { firestore } from "../../firebase";
import { useAppSelector } from "../../hooks/useAppSelector";
import { ITask } from "../../models/task";
import { IEmployer } from "../../models/user";
import TaskRequestsList from "../TaskRequestsList/TaskRequestsList";
import styles from "./TaskModal.module.css";

interface TaskModalProps {
  task: ITask;
  closeTask: () => void;
}

const TaskModal: FC<TaskModalProps> = ({ task, closeTask }) => {
  const { user } = useAppSelector(state => state.authReducer);
  const [taskEmployer, setTaskEmployer] = useState<IEmployer>({} as IEmployer);
  const [isTextExtended, setIsTextExtended] = useState(false);
  // console.log(task);

  const downloadFile = (file: string, index: number): void => {
    const a = document.createElement("a");
    a.href = file;
    a.setAttribute("target", "_blank");
    a.setAttribute("download", `file_${index}`);
    a.click();
  };

  const close = () => {
    closeTask();
    setIsTextExtended(false);
  };

  useEffect(() => {
    (async () => {
      if (task) {
        //  console.log(task.manager);
        const empCollection = collection(firestore, "employers");
        const employerQuery = query(
          empCollection,
          where("address", "==", task.manager)
        );
        let emp;
        const snap = await getDocs(employerQuery);
        //  console.log(snap[0]);
        snap.forEach((doc) => {
          setTaskEmployer(doc.data() as IEmployer);
        });
      }
    })();
  }, []);
  return (
    <div className={styles.TaskModal}>
      <button className={styles.closeTaskBtn} onClick={close}>
        <IoMdClose size={"1.3rem"} />
      </button>
      <h1>{task.title}</h1>
      <p className={styles.taskDate}>posted 02.05.2022 at 10:30</p>
      <div className={styles.info}>
        <div className={styles.taskInfo}>
          <p className={styles.taskDescription}>
            {isTextExtended ? (
              <>
                {task.description}
                <span onClick={() => setIsTextExtended(false)}>less</span>
              </>
            ) : (
              <>
                {task.description.slice(0, 300)}
                {task.description.length > 300 && (
                  <>
                    ...
                    <span onClick={() => setIsTextExtended(true)}>more</span>
                  </>
                )}
              </>
            )}
          </p>
          <ul className={styles.skillsList}>
            {["React.js", "JS", "html"].map((skill) => {
              return <li key={skill}>{skill}</li>;
            })}
          </ul>
          <div className={styles.taskFiles}>
            <h3 className={styles.filesTitle}>Pinned files:</h3>
            <ul className={styles.taskFileList}>
              {task.files.map((file, idx) => {
                return (
                  <li onClick={() => downloadFile(file, idx)}>file_{idx}</li>
                );
              })}
            </ul>
          </div>
          {user.type === "developers" ? (
            <Link href={`/createProposal?task_address=${task.address}`}>
              <button className={styles.proposalBtn} type="button">
                Create Request
              </button>
            </Link>
          ) : (
            <>
            <h3>Requests</h3>
            <TaskRequestsList task={task} />
            </>
          )}
        </div>
        <div className={styles.employerInfo}>
          <img
            className={styles.empImage}
            src={taskEmployer.profilePhoto as any}
            alt=""
          />
          <h3>{taskEmployer.username}</h3>
          <ul className={styles.empStats}>
            <li>
              <h4>ETH spent</h4>
              <p>{taskEmployer.moneysSpent}</p>
            </li>
            <li>
              <h4>Rating</h4>
              <p>{taskEmployer.rating}</p>
            </li>
            <li>
              <h4>Since</h4>
              <p>
                {taskEmployer.createdAt ? taskEmployer.createdAt : "01.07.22"}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
