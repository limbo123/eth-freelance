import { collection, getDocs, query, where } from "firebase/firestore";
import React, { FC, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { firestore } from "../../firebase";
import { ITask } from "../../models/task";
import { IEmployer } from "../../models/user";
import styles from "./TaskModal.module.css";

interface TaskModalProps {
  task: ITask;
  closeTask: () => void;
}

const TaskModal: FC<TaskModalProps> = ({ task, closeTask }) => {
    const [taskEmployer, setTaskEmployer] = useState<IEmployer>({} as IEmployer);

    useEffect(() => {
       if(task) {
         console.log(task.manager);
         const empCollection = collection(firestore, "employers");
        //  const employerQuery = query(empCollection, where("address", "==", task.manager));
         let emp;
        //  const snap = getDocs(employerQuery);
         // console.log(snap[0]);
       }
    }, [])
  return (
    <div className={styles.TaskModal}>
      <button className={styles.closeTaskBtn} onClick={closeTask}>
        <IoMdClose size={"1.3rem"} />
      </button>
      <h1>{task.title}</h1>
      <p className={styles.taskDate}>posted 02.05.2022 at 10:30</p>
      <div className={styles.info}>
        <div className={styles.taskInfo}>
          <p className={styles.taskDescription}>{task.description}</p>
        </div>
        <div className={styles.employerInfo}></div>
      </div>
    </div>
  );
};

export default TaskModal;
