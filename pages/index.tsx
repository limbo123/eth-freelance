import styles from "../styles/Home.module.css";
import { FC } from "react";
import { openAuthModal } from "../redux/auth/authSlice";
import { useAppSelector } from "../hooks/useAppSelector";
import { useDispatch } from "react-redux";
import { GiTrophiesShelf } from "@react-icons/all-files/gi/GiTrophiesShelf";
import { FaEthereum } from "@react-icons/all-files/fa/FaEthereum";
import { BsPencil } from "@react-icons/all-files/bs/BsPencil"

const Home: FC = () => {
  // const { isAuthModalOpened } = useAppSelector(
  //   (state) => state.authReducer
  // );
  const dispatch = useDispatch();
  return (
    <>
      <div className={styles.headingSection}>
        <h1>Want to find a work or a worker?</h1>
        <h3>GoFreelance is a first blockchain based freelance exchange</h3>
        <button
          className={styles.authBtn}
          onClick={() => dispatch(openAuthModal())}
        >
          Let's start now
        </button>
      </div>
      <div className={styles.mainSection}>
        <div className={styles.container}>
          <div className={styles.benefits}>
            <h2>Why GoFreelance?</h2>
            <div className={styles.cards}>
              <div className={styles.card}>
                <h3>1. Safe payment system</h3>
                <FaEthereum className={styles.cardIcon}/>
                <p>
                  We provide the safest payment system because it's launched on
                  Ethereum network
                </p>
              </div>
              <div className={styles.card}>
                <h3>2. Comfortable design</h3>
                <BsPencil className={styles.cardIcon}/>
                <p>
                  Peoples loves our simple and easy to understand design
                </p>
              </div>
              <div className={styles.card}>
                <h3>3. We want to become better</h3>
                <GiTrophiesShelf className={styles.cardIcon}/>
                <p>
                  We really love our community and listens to their proposals
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
