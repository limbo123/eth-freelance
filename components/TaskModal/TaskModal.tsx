import React, { FC } from 'react'
import { IoMdClose } from 'react-icons/io';
import { ITask } from '../../models/task'
import styles from "./TaskModal.module.css"

interface TaskModalProps {
    task: ITask;
    closeTask: () => void;
}

const TaskModal: FC<TaskModalProps> = ({ task, closeTask }) => {
  return (
    <div className={styles.TaskModal}>
        <button className={styles.closeTaskBtn} onClick={closeTask}><IoMdClose size={"1.3rem"}/></button>
        <h1>{task.title}</h1>
        <p className={styles.taskDate}>posted 02.05.2022 at 10:30</p>
    </div>
  )
}

export default TaskModal