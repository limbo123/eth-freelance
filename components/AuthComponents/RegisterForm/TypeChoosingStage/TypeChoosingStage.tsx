import classNames from 'classnames'
import React, { FC } from 'react'
import styles from "./TypeChoosingStage.module.css"

interface TypeChoosingStageProps {
    accountType: string,
    setAccountType: (type: string) => void,
    goToNextStep: () => void,
}

const TypeChoosingStage: FC<TypeChoosingStageProps> = ({ accountType, setAccountType, goToNextStep }) => {
  return (
    <div className={styles.accountTypeChoose}>
          <div
            className={accountType === "employers" ? classNames(styles.typeVariant, styles.activeVariant) : styles.typeVariant}
            onClick={() => setAccountType("employers")}
          >
            <h3>I&aposm Employer</h3>
            <p>and I want to find the developer</p>
          </div>
          <div
            className={accountType === "developers" ? classNames(styles.typeVariant, styles.activeVariant) : styles.typeVariant}
            onClick={() => setAccountType("developers")}
          >
            <h3>I&aposm Developer</h3>
            <p>and I want to find the work</p>
          </div>
          <button type="button" onClick={goToNextStep} className={styles.registerBtn} style={accountType === "" ? {opacity: 0.5} : {opacity: 1}}>Next</button>
        </div>
  )
}

export default TypeChoosingStage