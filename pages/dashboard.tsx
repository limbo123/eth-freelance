import React, { FC, useEffect, useState } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import { ITask } from "../models/task";
import { animated, useSpring } from "react-spring";
import TaskModal from "../components/TaskModal/TaskModal";
import DevDashboard from "../components/DevDashboard/DevDashboard";
import EmpDashboard from "../components/EmpDashboard/EmpDashboard";
import Router from "next/router";
import getTasks from "../api/getTasks";

const Dashboard: FC = () => {
  const { user } = useAppSelector((state) => state.authReducer);
  const [searchWorkInput, setSearchWorkInput] = useState("");
  const [results, setResults] = useState<ITask[]>([]);
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
    Router.replace(`/dashboard?task_address=${task.address}`, undefined, {
      scroll: false,
    });
  };

  const closeTask = () => {
    setIsTaskShowing(false);
    Router.replace("/dashboard", undefined, { scroll: false });
  };

  useEffect(() => {
    if (user.address) {
      (async () => {
        const res: ITask[] = (await getTasks(user)) as ITask[];
        setResults(res);
      })();
    }
  }, [user]);

  useEffect(() => {
    if (Router.query.task_address && results.length > 0) {
      const task = results.find(
        (task: ITask) => task.address === Router.query.task_address
      );
      if (task) {
        setTask(task);
      }
    }
  }, [results]);
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
          <TaskModal task={activeTask} closeTask={closeTask} />
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