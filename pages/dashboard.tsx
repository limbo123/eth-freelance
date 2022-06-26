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
      (async() => {
        const allTasksAddresses = await TaskFactory.methods.getAllTasks().call()
        allTasksAddresses.map(async(address, idx, arr) => {
          const taskContract = await new web3.eth.Contract(taskContractInfo.abi, address);
          const task = await taskContract.methods.getInfo().call();
          allTasks.push(task);
          if(idx === arr.length - 1) {
            setResults(allTasks);
          }
        })
      })()
    }, []);
    console.log(results);
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
