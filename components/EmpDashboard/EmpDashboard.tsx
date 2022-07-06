import classNames from 'classnames';
import Link from 'next/link';
import React, { FC } from 'react'
import { AiFillFolder, AiOutlineSearch } from 'react-icons/ai';
import { useAppSelector } from '../../hooks/useAppSelector';
import { ITask } from '../../models/task';
import styles from "../../styles/Dashboard.module.css";

interface EmpDashboardProps {
    tasks: ITask[],
    setTask: (param: ITask) => void,
}

const EmpDashboard: FC<EmpDashboardProps> = ({ tasks, setTask }) => {
    const { user } = useAppSelector(state => state.authReducer);
  return (
    <div className={styles.container}>
          <div className={classNames(styles.greetings, styles.greetingsEmp)}>
            <h1>
              Welcome, {user.username} <span>:)</span>
            </h1>
            <h2>Ready to manage your tasks?</h2>
            <div>
              <button type="button" className={styles.createTaskBtn}>
                Find Talent{" "}
                <AiOutlineSearch style={{ marginLeft: 10 }} size={"1.2rem"} />
              </button>
              <Link href={"/createTask"}>
                <button type="button" className={styles.createTaskBtn}>
                  Create Task +
                </button>
              </Link>
            </div>
          </div>
          <div className={styles.empTasksSection}>
            <h2 className={styles.sectionHeader}>Your tasks</h2>
            {tasks.map((task: ITask, idx) => {
              return (
                <div
                  key={idx}
                  onClick={() => setTask(task)}
                  className={styles.taskCard}
                >
                  <h2>{task.title}</h2>
                  <div className={styles.taskStatistics}>
                    <button type="button">
                      View Full Stats{" "}
                      <AiFillFolder
                        style={{ marginLeft: 10 }}
                        size={"1.2rem"}
                      />
                    </button>
                    <ul>
                      <li>
                        <div className={styles.stat}>
                          <h4>Applicants</h4>
                          {task.requestsKeys.length}
                        </div>
                      </li>
                      <li>
                        <div className={styles.stat}>
                          <h4>Status</h4>
                          {task.isCompleted
                            ? "Completed"
                            : +task.worker === 0
                            ? "Not started"
                            : "In progress"}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
  )
}

export default EmpDashboard;