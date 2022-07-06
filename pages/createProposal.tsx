import Router from "next/router";
import React, { FC, useEffect, useState } from "react";
import TaskFactory from "../ethereum/TaskFactory";
import web3 from "../ethereum/web3";
import taskObj from "../ethereum/build/Task.json";

import styles from "../styles/CreateProposalPage.module.css";
import { useAppSelector } from "../hooks/useAppSelector";

const createProposal: FC = () => {
  const [proposalDesc, setProposalDesc] = useState("");
  const { user } = useAppSelector(state => state.authReducer);

  const createRequest = async () => {
    const currentTask = await new web3.eth.Contract(
      taskObj.abi,
      Router.query.task_address
    );
    console.log(user.address);
    try {
      await currentTask.methods.creaetRequest(proposalDesc).send({
        from: user.address
      })
    } catch (error: any) {
      console.log(error.code);
      if(error.code === -32602) {
        console.log("You must be logged in metamask at correct account");
      }
    }
  };
  return (
    <div className={styles.container}>
      <h1>Create proposal</h1>
      <textarea
        id=""
        className={styles.descInput}
        onChange={(e) => setProposalDesc(e.target.value)}
        value={proposalDesc}
      ></textarea>
      <button type="button" onClick={createRequest}>
        Create Request
      </button>
    </div>
  );
};

export default createProposal;
