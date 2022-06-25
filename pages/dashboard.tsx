import React, { FC, useEffect, useState } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import styles from "../styles/Dashboard.module.css";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdArrowDropdown } from "react-icons/io";
import Link from "next/link";
import TaskFactory from "../ethereum/TaskFactory";

const Dashboard: FC = () => {
  const { user } = useAppSelector((state) => state.authReducer);
  const [searchWorkInput, setSearchWorkInput] = useState("");
  useEffect(() => {
    (async() => {
      const allTasks = await TaskFactory.methods.getAllTasks().call();
      console.log(allTasks);
    })()
  }, [])
  return (
    <>
      {user.type && user.type === "developers" && (
        <div className={styles.container}>
          <div className={styles.greetings}>
            <h1>
              Welcome, {user.username} <span>:)</span>
            </h1>
            <h2>Are you ready to work?</h2>
            <div>
            <form action="" className={styles.searchWorkForm}>
              <input type="text" placeholder="Search there" value={searchWorkInput} onChange={(e) => setSearchWorkInput(e.target.value)}/>
            <button type="button" className={styles.findWorkBtn}>
                Search Work <AiOutlineSearch size={"1.2rem"} />
              </button>
            </form>
              
              <a>
                Or find below <IoMdArrowDropdown />
              </a>
            </div>
          </div>

          
          </div>
      )}
      {user.type && user.type === "employers" && 
      <div className={styles.container}>
        <Link href={"/createTask"}>
          <button type="button" className={styles.createTaskBtn}>Create Task</button>
        </Link>
      </div>
      }

    </>
  );
};

export default Dashboard;
