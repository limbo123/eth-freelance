import React, { FC } from "react";
import { ReactReduxContextValue } from "react-redux";
import styles from "./SphereChoosing.module.css";

interface SphereChoosingProps {
  goToNextStep: () => void;
  sphere: string;
  setSphere: (newSphere: string) => void;
}

const SphereChoosing: FC<SphereChoosingProps> = ({
  goToNextStep,
  sphere,
  setSphere,
}) => {
  return (
    <>
      <div className={styles.sphereChoosing}>
        <h2 className={styles.header}>Choose your sphere:</h2>
        <select
          className={styles.sphereSelect}
          onChange={(e) => setSphere(e.target.value)}
        >
          {[
            "Choose your sphere",
            "Design",
            "IT Development",
            "Admin Support",
            "Media development",
          ].map((option) => {
            return (
              <option key={option} value={option}>
                {option}
              </option>
            );
          })}
        </select>
        <button type="button" className={styles.button} onClick={goToNextStep}>
          Next
        </button>
      </div>
    </>
  );
};

export default SphereChoosing;
