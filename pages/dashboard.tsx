import React, { FC, useEffect, useState } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import styles from "../styles/Dashboard.module.css";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdArrowDropdown } from "react-icons/io";
import Link from "next/link";
import TaskFactory from "../ethereum/TaskFactory";
import web3 from "../ethereum/web3";
import taskContractInfo from "../ethereum/build/Task.json";

const Dashboard: FC = () => {
  const { user } = useAppSelector((state) => state.authReducer);
  const [searchWorkInput, setSearchWorkInput] = useState("");
  const [results, setResults] = useState([]);
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
        console.log(task);
        if (user.type === "developers") {
          // console.log("user -dev");
          if (task["4"] === user.sphere) {
            allTasks.push(task);
          }
        } else {
          // console.log("user -emp");
          if (task["0"] === user.address) {
            allTasks.push(task);
          }
        }
        // allTasks.push(task);
        if (idx === arr.length - 1) {
          setResults(allTasks);
        }
      });
    })();
  }, [user]);
  // console.log(results);
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

            {results.map((task, idx) => {
              if(idx !== 0) {
                return <div key={idx} className={styles.taskCard}>
                <h2>{task["1"]}</h2>
                <p>{task["3"]}</p>
               <ul className={styles.skillsList}>
               {["React.js", "JS", "html"].map(skill => {
                  return <li key={skill}>{skill}</li>
                })}
               </ul>
              </div>
              }
            })}
          </div>

        </div>
      )}
      {user.type && user.type === "employers" && (
        <div className={styles.container}>
          <Link href={"/createTask"}>
            <button type="button" className={styles.createTaskBtn}>
              Create Task
            </button>
          </Link>
        </div>
      )}
    </>
  );
};

export default Dashboard;
