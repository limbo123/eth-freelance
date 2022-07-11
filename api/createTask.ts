import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import shortid from "shortid";
import web3 from "../ethereum/web3";
import { storage } from "../firebase";
import TaskFactory from "../ethereum/TaskFactory";

export default async (
  files,
  titleInput,
  descriptionInput,
  sphereSelect,
  skillsArr,
  priceInput,
  userAddress
) => {
  const filesArr: string[] = [];

  files.forEach((file, idx, arr) => {
    const storageRef = ref(
      storage,
      "tasksAddedFiles/" + `${shortid.generate()}${file.name}`
    );

    if (idx !== arr.length - 1) {
      uploadBytes(storageRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadUrl) => {
          console.log(downloadUrl);
          filesArr.push(downloadUrl);
        });
      });
    } else {
      uploadBytes(storageRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (downloadUrl) => {
          filesArr.push(downloadUrl);
          console.log(downloadUrl);
          setTimeout(async () => {
            console.log("creating txn");
            console.log(filesArr);

            try {
              const task = await TaskFactory.methods
                .createTask(
                  titleInput,
                  descriptionInput,
                  sphereSelect,
                  filesArr,
                  skillsArr
                )
                .send({
                  from: userAddress,
                  value: web3.utils.toWei(priceInput, "ether"),
                });
              console.log(task);
            } catch (error: any) {
              console.log(error.code);
              if (error.code === -32602) {
                console.log(
                  "You must be logged in metamask at correct account"
                );
              }
            }
          }, 2000);
        });
      });
    }
  });
};
