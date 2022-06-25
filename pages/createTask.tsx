import React, { FC, useEffect, useState } from "react";
import styles from "../styles/CreateTaskPage.module.css";

const createTask: FC = () => {
  // const [stage, setStage] = useState(0);
  const [titleInput, setTitleInput] = useState("");
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
  }
  useEffect(() => {
    console.log(files);
  }, [files]);
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
          value={titleInput}
          placeholder="Set title here"
          onChange={(e) => setTitleInput(e.target.value)}
        />
      </div>
      <div className={styles.titleStage}>
        <h1>Step 3. Specify skills</h1>
        <input
          type="text"
          value={titleInput}
          placeholder="Set title here"
          onChange={(e) => setTitleInput(e.target.value)}
        />
      </div>
      <div className={styles.titleStage}>
        <h1>Step 4. Set price</h1>
        <input
          type="text"
          value={titleInput}
          placeholder="Set title here"
          onChange={(e) => setTitleInput(e.target.value)}
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
    </div>
  );
};

export default createTask;
