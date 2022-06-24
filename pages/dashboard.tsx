import React, { FC } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import styles from "../styles/Dashboard.module.css";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdArrowDropdown } from "react-icons/io";

const Dashboard: FC = () => {
  const { user } = useAppSelector((state) => state.authReducer);
  return (
    <>
      {user.username && (
        <div className={styles.container}>
          <div className={styles.greetings}>
            <h1>
              Welcome, {user.username} <span>:)</span>
            </h1>
            <h2>Are you ready to work?</h2>
            <div>
              <button type="button" className={styles.findWorkBtn}>
                Search Work <AiOutlineSearch size={"1.2rem"} />
              </button>
              <a>
                Or find below <IoMdArrowDropdown />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
