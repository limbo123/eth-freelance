import classNames from "classnames";
import React, { FC, memo, useEffect, useState } from "react";
import web3 from "../../../ethereum/web3";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { ITask } from "../../../models/task";
import styles from "../../../styles/Dashboard.module.css";
import { AiOutlineSearch } from "@react-icons/all-files/ai/AiOutlineSearch";
import { FaEthereum } from "@react-icons/all-files/fa/FaEthereum";
import { IoMdArrowDropdown } from "@react-icons/all-files/io/IoMdArrowDropdown";
import { IDeveloper } from "../../../models/user";

interface DevDashboardProps {
  tasks: ITask[];
  setTask: (param: ITask) => void;
  searchWorkInput: string;
  setSearchWorkInput: (param: string) => void;
}

const DevDashboard: FC<DevDashboardProps> = ({
  tasks,
  setTask,
  searchWorkInput,
  setSearchWorkInput,
}) => {
  const { user } = useAppSelector((state) => state.authReducer) as any;
  const [skillsFilters, setSkillsFilters] = useState<string[]>([]);
  // const [priceFilters, setPricefFilers] = useState<number[]>([]);
  const [allTasks, setAllTasks] = useState<ITask[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    setAllTasks(tasks);
  }, [tasks]);

  const toggleSkillFilter = (skill) => {
    if (!skillsFilters.includes(skill)) {
      setSkillsFilters([...skillsFilters, skill]);
      return;
    }

    setSkillsFilters(skillsFilters.filter((currSkill) => currSkill !== skill));
  };

  const filterTasks = (e: React.SyntheticEvent) => {
    e.preventDefault();

    setAllTasks(
      tasks.filter((task) => {
        const isSkillsMatch =
          skillsFilters.length > 0
            ? skillsFilters.some((skill) => {
                console.log(skill);
                return task.skills.includes(skill);
              })
            : true;
        if (isSkillsMatch) {
          console.log("skillsMatcj");
          if(maxPrice && minPrice) {
            console.log("min max price is exists");
            const taskPrice = +web3.utils.fromWei(task.price, "ether");
            console.log(taskPrice);
            if(taskPrice >= +minPrice && taskPrice <= +maxPrice) {
              console.log("match");
              return task;
            }
          } else {
          return task;
          }
          
        }
      })
    );
  };

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
      <h2 className={styles.sectionHeader}>Recommended for you</h2>

      <div className={styles.tasksSection}>
        <div className={styles.tasksList}>
          {allTasks.map((task: ITask, idx) => {
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
                    {task.skills.map((skill) => {
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
        <div className={styles.filters}>
          <form onSubmit={filterTasks}>
            <h3>Filter your tasks</h3>
            <div className={styles.skillsFiltering}>
              <h4>Filter by your skills:</h4>
              <ul className={styles.userSkillsList}>
                {user.skills.map((skill) => {
                  return (
                    <li
                    key={skill}
                      className={
                        skillsFilters.includes(skill)
                          ? styles.activeSkill
                          : styles.inctiveSkill
                      }
                      onClick={() => toggleSkillFilter(skill)}
                    >
                      {skill}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className={styles.priceFiltering}>
              <h4>Filter by price: </h4>
              <input
                value={minPrice}
                id="minPrice"
                type="number"
                placeholder="min ETH"
                onChange={(e) =>
                  setMinPrice(e.target.value)
                }
              />
              <input
                value={maxPrice}
                id="maxPrice"
                type="number"
                placeholder="max ETH"
                onChange={(e) =>
                  setMaxPrice(e.target.value)
                }
              />
            </div>

            <button type="submit">Filter</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DevDashboard;
