import React, { FC, useEffect, useState } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import styles from "../styles/Dashboard.module.css";
import { AiFillFolder, AiOutlineSearch } from "react-icons/ai";
import { IoMdArrowDropdown } from "react-icons/io";
import Link from "next/link";
import TaskFactory from "../ethereum/TaskFactory";
import web3 from "../ethereum/web3";
import taskContractInfo from "../ethereum/build/Task.json";
import classNames from "classnames";
import { ITask } from "../models/task";
import { animated, useSpring } from "react-spring";
import TaskModal from "../components/TaskModal/TaskModal";

const Dashboard: FC = () => {
  const { user } = useAppSelector((state) => state.authReducer);
  const [searchWorkInput, setSearchWorkInput] = useState("");
  const [results, setResults] = useState([]);
  const [isTaskShowing, setIsTaskShowing] = useState(false);
  const [activeTask, setActiveTask] = useState<ITask>({} as ITask);

  const TaskStyles = useSpring({
    position: "fixed",
    margin: "auto",
    bottom: activeTask.address ? "0" : "-100vh",
    // boxShadow: activeTask.address ? "0px -5px 88px 40px rgba(34, 60, 80, 0.2)" : "none"
  });

  useEffect(() => {
    const allTasks: any = [];
    (async () => {
      const allTasksAddresses = await TaskFactory.methods.getAllTasks().call();
      allTasksAddresses.map(async (address, idx, arr) => {
        const taskContract = await new web3.eth.Contract(
          taskContractInfo.abi,
          address
        );
        const task = await taskContract.methods.getInfo().call();
        // console.log(task);
        if (user.type === "developers") {
          if (task["4"] === user.sphere && +task["5"] === 0) {
            const taskObj: ITask = {
              manager: task["0"],
              title: task["1"],
              files: task["2"],
              description: task["3"],
              sphere: task["4"],
              worker: task["5"],
              isCompleted: task["6"],
              requestsKeys: task["7"],
              address: address,
            };
            allTasks.push(taskObj);
          }
        } else {
          if (task["0"] === user.address) {
            const taskObj: ITask = {
              manager: task["0"],
              title: task["1"],
              files: task["2"],
              description: task["3"],
              sphere: task["4"],
              worker: task["5"],
              isCompleted: task["6"],
              requestsKeys: task["7"],
              address: address,
            };
            allTasks.push(taskObj);
          }
        }
        if (idx === arr.length - 1) {
          setResults(allTasks);
        }
      });
    })();
  }, [user]);
  return (
    <>
    <animated.div style={{
      ...TaskStyles
    }}>
    <TaskModal task={activeTask} closeTask={() => setActiveTask({} as ITask)} />
    </animated.div>
      {user.type && user.type === "developers" && (
        <div className={styles.container}>
          <div className={classNames(styles.greetings, styles.greetingsDev)}>
            <h1>
              Welcome, {user.username} <span>:)</span>
            </h1>
            <h2>Are you ready to work?</h2>
            <div>
              <form action="" className={styles.searchWorkForm}>
                <input
                  type="text"
                  placeholder="Search there"
                  value={searchWorkInput}
                  onChange={(e) => setSearchWorkInput(e.target.value)}
                />
                <button type="button" className={styles.findWorkBtn}>
                  Search Work <AiOutlineSearch size={"1.2rem"} />
                </button>
              </form>

              <a>
                Or find below <IoMdArrowDropdown />
              </a>
            </div>
          </div>
          <div className={styles.tasksSection}>
            <h2 className={styles.sectionHeader}>Recommended for you</h2>

            {results.map((task: ITask, idx) => {
              // if (idx !== 0) {
              return (
                // <Link href={`${task.address}/`}>
                  <div key={idx} onClick={() => setActiveTask(task)} className={styles.taskCard}>
                    <h2>{task.title}</h2>
                    <p>{task.description}</p>
                    <div>
                      <ul className={styles.skillsList}>
                        {["React.js", "JS", "html"].map((skill) => {
                          return <li key={skill}>{skill}</li>;
                        })}
                      </ul>
                      {/* <Link href={`${task.address}/createProposal`}> */}
                        <button className={styles.proposalPageBtn}>
                          Create Proposal +
                        </button>
                      {/* </Link> */}
                    </div>
                  </div>
                // </Link>
              );
              // }
            })}
          </div>
        </div>
      )}
      {user.type && user.type === "employers" && (
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
            {results.map((task: ITask, idx) => {
              // if (idx !== 0) {
              return (
                <div key={idx} onClick={() => setActiveTask(task)}  className={styles.taskCard}>
                  <h2>{task.title}</h2>
                  {/* <h3>Statistics:</h3> */}
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
              // }
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
