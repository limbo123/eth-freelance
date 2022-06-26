import React, { FC, useEffect, useState } from "react";
import styles from "../styles/CreateTaskPage.module.css";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import TaskFactory from "../ethereum/TaskFactory";
import web3 from "../ethereum/web3";

const createTask: FC = () => {
  // const [stage, setStage] = useState(0);
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [sphereSelect, setSphereSelect] = useState("");
  const [skillsArr, setSkillsArr] = useState<string[]>([]);
  const [priceInput, setPriceInput] = useState("");
  const [skillsInput, setSkillsInput] = useState("");

  const [files, setFiles] = useState<Array<File>>([]);

  const addFile = (e: React.SyntheticEvent) => {
    const inputEl = e.target as HTMLInputElement;
    const fileList = inputEl.files as FileList;
    setFiles([...files, fileList[0]]);
    console.log();
  };

  const downloadFile = (file: File) => {
    console.log(file);
    const fileURL = URL.createObjectURL(file);
    // console.log(fileURL);
    // const image = document.querySelector("#image") as HTMLImageElement;
    // image.src = fileURL;
    const a = document.createElement("a");
    a.href = fileURL;
    a.setAttribute("download", file.name);
    a.click();
  };

  const createTask = async() => {
    const filesArr: string[] = [];
    const accounts = await web3.eth.getAccounts();

    files.forEach((file, idx, arr) => {
      const storageRef = ref(storage, "tasksAddedFiles/" + file.name);

      if(idx !== arr.length - 1) {
        
        uploadBytes(storageRef, file).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((downloadUrl) => {
            filesArr.push(downloadUrl);
          })
        })
      } else {
        uploadBytes(storageRef, file).then((snapshot) => {
          getDownloadURL(snapshot.ref).then(async(downloadUrl) => {
            filesArr.push(downloadUrl);
            const task = await TaskFactory.methods.createTask(titleInput, descriptionInput, filesArr, skillsArr).send({ from: accounts[0] });
            console.log(task);
          })
        })
      }
    })
    // console.log(filesArr);

  }
  return (
    <div className={styles.container}>
      <div className={styles.titleStage}>
        <h1>Step 1. Name the task</h1>
        <input
          type="text"
          value={titleInput}
          placeholder="Set title here"
          onChange={(e) => setTitleInput(e.target.value)}
        />
      </div>
      <div className={styles.titleStage}>
        <h1>Step 2. Add the description</h1>
        <input
          type="text"
          value={descriptionInput}
          placeholder="Set title here"
          onChange={(e) => setDescriptionInput(e.target.value)}
        />
      </div>
      <div className={styles.titleStage}>
        <h1>Step 3. Choose the sphere</h1>
        <select onChange={(e) => setSphereSelect(e.target.value)}>
          {[
            "Choose your sphere",
            "Design",
            " IT Development",
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
      </div>
      <div className={styles.titleStage}>
        <h1>Step 4. Specify skills</h1>
        <input
          type="text"
          value={skillsInput}
          placeholder="Set title here"
          onChange={(e) => setSkillsInput(e.target.value)}
        />
      </div>
      <div className={styles.titleStage}>
        <h1>Step 5. Set price</h1>
        <input
          type="number"
          value={priceInput}
          placeholder="Set title here"
          onChange={(e) => setPriceInput(e.target.value)}
        />
      </div>
      <div className={styles.titleStage}>
        <h1>Pin a files</h1>
        <img src="" id="image" alt="" />
        <input type="file" placeholder="Set title here" onChange={addFile} />
        <ul>
          {files.map((file) => {
            return (
              <li onClick={() => downloadFile(file)}>
                <a>{file.name}</a>
              </li>
            );
          })}
        </ul>
      </div>

      <button type="button" onClick={createTask}>Create</button>
    </div>
  );
};

export default createTask;
