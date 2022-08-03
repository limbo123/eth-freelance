import React, { FC, useState } from "react";
import styles from "./CreateProposal.module.css";
import { useAppSelector } from "../../../hooks/useAppSelector";
import createProposal from "../../../api/createProposal";

interface CreateProposalProps {
  taskAddress: string;
}

const CreateProposal: FC<CreateProposalProps> = ({ taskAddress }) => {
  const [proposalDesc, setProposalDesc] = useState("");
  const { user } = useAppSelector(state => state.authReducer);

  const createRequest = async () => {
    createProposal(proposalDesc, user, taskAddress);
    setProposalDesc("");
  };
  return (<>
  
  <div className={styles.createProposal}>
      <h1>Create proposal</h1>
      <p>At least 50 symbols ({proposalDesc.length}/50)</p>
      <textarea
        placeholder="Describe, why the customer have to choose you"
        id=""
        className={styles.descInput}
        onChange={(e) => setProposalDesc(e.target.value)}
        value={proposalDesc}
      ></textarea>
      <button type="button" disabled={proposalDesc.length < 50} onClick={createRequest}>
        Create Request
      </button>
    </div>
  </>
  );
};

export default CreateProposal;
