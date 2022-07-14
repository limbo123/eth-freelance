import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import styles from "../styles/CreateTaskPage.module.css";
import { MdDone } from "react-icons/md";
import { useAppSelector } from "../hooks/useAppSelector";
import Slider from "react-slick";
import createTaskFn from "../api/createTask";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import classNames from "classnames";
import { AiOutlinePlus } from "react-icons/ai";
import Image from "next/image";


const CreateTask: FC = () => {
  // const [stage, setStage] = useState(0);
  const { user } = useAppSelector((state) => state.authReducer);
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [sphereSelect, setSphereSelect] = useState("Choose your sphere");
  const [skillsArr, setSkillsArr] = useState<string[]>([]);
  const [priceInput, setPriceInput] = useState("");
  const [skillsInput, setSkillsInput] = useState("");

  const [files, setFiles] = useState<Array<File>>([]);

  const sliderRef = useRef(null);

  const sliderOptions = useMemo(() => ({
    dots: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: false,
    arrows: false,
    swipe: false,
    touchMove: false,
  }), [])

  const addFile = (e: React.SyntheticEvent) => {
    const inputEl = e.target as HTMLInputElement;
    const fileList = inputEl.files as FileList;
    setFiles([...files, fileList[0]]);
    console.log();
  };

  const downloadFile = (file: File) => {
    console.log(file);
    const fileURL = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = fileURL;
    a.setAttribute("download", file.name);
    a.click();
  };

  const createTask = async () => {
    createTaskFn(
      files,
      titleInput,
      descriptionInput,
      sphereSelect,
      skillsArr,
      priceInput,
      user.address
    );
  };

  const nextStep = () => {
    const slider = sliderRef.current as any;
    if (slider) {
      slider.slickNext();
    }
  };

  const prevStep = () => {
    const slider = sliderRef.current as any;
    if (slider) {
      slider.slickPrev();
    }
  };

  return (
    <div className={styles.container}>
      <Slider {...sliderOptions} ref={sliderRef}>
        <div className={classNames(styles.titleStage, styles.stage)}>
          <h1>Name the task</h1>
          <input
            type="text"
            value={titleInput}
            placeholder="Set title here"
            onChange={(e) => setTitleInput(e.target.value)}
          />
          <div className={styles.controls}>
            <button
              className={styles.arrowBtn}
              disabled={titleInput.length < 3}
              onClick={nextStep}
            >
              Next
            </button>
          </div>
        </div>

        <div className={classNames(styles.descStage, styles.stage)}>
          <h1>Add the description</h1>
          <p>{descriptionInput.length}/3000 (At least 100 symbols)</p>
          <textarea
            value={descriptionInput}
            placeholder="Set description here"
            onChange={(e) => setDescriptionInput(e.target.value)}
            className={styles.descriptionField}
          ></textarea>
          <div className={styles.controls}>
            <button className={styles.arrowBtn} onClick={prevStep}>
              Prev
            </button>
            <button
              className={styles.arrowBtn}
              disabled={
                descriptionInput.length < 100 || descriptionInput.length > 3000
              }
              onClick={nextStep}
            >
              Next
            </button>
          </div>
        </div>

        <div className={classNames(styles.sphereStage, styles.stage)}>
          <h1>Choose the sphere</h1>
          <select onChange={(e) => setSphereSelect(e.target.value)}>
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
          <div className={styles.controls}>
            <button className={styles.arrowBtn} onClick={prevStep}>
              Prev
            </button>
            <button
              className={styles.arrowBtn}
              disabled={sphereSelect === "Choose your sphere"}
              onClick={nextStep}
            >
              Next
            </button>
          </div>
        </div>

        <div className={classNames(styles.skillsStage, styles.stage)}>
          <h1>Specify skills</h1>
          <input
            type="text"
            value={skillsInput}
            placeholder="Set title here"
            onChange={(e) => setSkillsInput(e.target.value)}
          />
          <div className={styles.controls}>
            <button className={styles.arrowBtn} onClick={prevStep}>
              Prev
            </button>
            <button
              className={styles.arrowBtn}
              disabled={titleInput.length < 3}
              onClick={nextStep}
            >
              Next
            </button>
          </div>
        </div>

        <div className={classNames(styles.priceStage, styles.stage)}>
          <h1>Set price</h1>
          <input
            type="number"
            value={priceInput}
            placeholder="Set title here"
            onChange={(e) => setPriceInput(e.target.value)}
          />
          <div className={styles.controls}>
            <button className={styles.arrowBtn} onClick={prevStep}>
              Prev
            </button>
            <button
              className={styles.arrowBtn}
              disabled={+priceInput <= 0}
              onClick={nextStep}
            >
              Next
            </button>
          </div>
        </div>

        <div className={classNames(styles.filesStage, styles.stage)}>
          <h1>Pin a files (optional)</h1>
          <label htmlFor="task-files" className={styles.addTFilesLabel}><AiOutlinePlus color="#8025b1" size={"2rem"} />
          Add
          </label>
          <input type="file" id="task-files" style={{ display: "none" }} placeholder="Set title here" onChange={addFile} />
          <ul>
            {files.map((file) => {
              return (
                <li key={file.name} onClick={() => downloadFile(file)}>
                  <a>{file.name}</a>
                </li>
              );
            })}
          </ul>

          <div className={styles.controls}>
            <button className={styles.arrowBtn} onClick={prevStep}>
              Prev
            </button>
            <button type="button" className={styles.createTaskBtn} onClick={createTask}>
              Create <MdDone size={"1.2rem"}/>
            </button>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default CreateTask;
