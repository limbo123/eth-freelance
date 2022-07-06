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
import DevDashboard from "../components/DevDashboard/DevDashboard";
import EmpDashboard from "../components/EmpDashboard/EmpDashboard";
import Router from "next/router";

const Dashboard: FC = () => {
  const { user } = useAppSelector((state) => state.authReducer);
  const [searchWorkInput, setSearchWorkInput] = useState("");
  const [results, setResults] = useState([]);
  const [isTaskShowing, setIsTaskShowing] = useState(false);
  const [activeTask, setActiveTask] = useState<ITask>({} as ITask);

  const TaskStyles = useSpring({
    position: "fixed",
    margin: "auto",
    bottom: isTaskShowing ? "0" : "-100vh",
  });

  const setTask = (task: ITask) => {
    setActiveTask(task);
    setIsTaskShowing(true);
    Router.replace(`/dashboard?task_address=${task.address}`,  undefined, { scroll: false });
  };

  const closeTask = () => {
    setIsTaskShowing(false);
    Router.replace("/dashboard", undefined, { scroll: false });
  }

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

  useEffect(() => {
    if(Router.query.task_address && results.length > 0) {
      const task = results.find((task: ITask) => task.address === Router.query.task_address)
      if(task) {
        setTask(task)
      }
    }
  }, [results])
  return (
    <>
      <animated.div
        style={
          {
            ...TaskStyles,
          } as any
        }
      >
        {activeTask && activeTask.address && (
          <TaskModal
            task={activeTask}
            closeTask={closeTask}
          />
        )}
      </animated.div>
      {user.type && user.type === "developers" && (
        <DevDashboard
          tasks={results}
          searchWorkInput={searchWorkInput}
          setSearchWorkInput={setSearchWorkInput}
          setTask={setTask}
        />
      )}
      {user.type && user.type === "employers" && (
        <EmpDashboard tasks={results} setTask={setTask} />
      )}
    </>
  );
};

export default Dashboard;
