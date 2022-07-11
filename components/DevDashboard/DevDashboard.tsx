import classNames from "classnames";
import React, { FC, memo } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdArrowDropdown } from "react-icons/io";
import web3 from "../../ethereum/web3";
import { useAppSelector } from "../../hooks/useAppSelector";
import { ITask } from "../../models/task";
import styles from "../../styles/Dashboard.module.css";
import { FaEthereum } from "react-icons/fa";

interface DevDashboardProps {
  tasks: ITask[];
  setTask: (param: ITask) => void;
  searchWorkInput: string;
  setSearchWorkInput: (param: string) => void;
}

const DevDashboard: FC<DevDashboardProps> = memo(
  ({ tasks, setTask, searchWorkInput, setSearchWorkInput }) => {
    const { user } = useAppSelector((state) => state.authReducer);

    return (
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

          {tasks.map((task: ITask, idx) => {
            console.log("render");
            return (
              <div
                key={idx}
                onClick={() => setTask(task)}
                className={styles.taskCard}
              >
                <div className={styles.TaskCardHeader}>
                  <h2>{task.title}</h2>
                  <h2 className={styles.price}>
                    {web3.utils.fromWei(task.price, "ether")} <FaEthereum />
                  </h2>
                </div>
                <p>{task.description}</p>
                <div>
                  <ul className={styles.skillsList}>
                    {["React.js", "JS", "html"].map((skill) => {
                      return <li key={skill}>{skill}</li>;
                    })}
                  </ul>
                  <button className={styles.proposalPageBtn}>
                    Create Proposal +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

export default DevDashboard;
