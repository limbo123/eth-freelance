import React, { FC } from 'react'
import styles from "./SkillsStage.module.css";

interface SkillSStageProps {
    setSkillsInput: (param: string) => void;
    goToNextStep: () => void;
    skillsInput: string
}

const SkillsStage: FC<SkillSStageProps> = ({ setSkillsInput, goToNextStep, skillsInput }) => {
  return (
    <div className={styles.skillsChoosing}>
        <h2 className={styles.header}>Choose your skills:</h2>
        <input
        value={skillsInput}
          className={styles.skillsInput}
          onChange={(e) => setSkillsInput(e.target.value)}
        />
         
        <button type="button" className={styles.button} onClick={goToNextStep}>
          Next
        </button>
      </div>
  )
}

export default SkillsStage