import firebase from "firebase/compat/app";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import shortid from "shortid";
import { firestore, storage } from "../firebase";

const sendFileMessage = async (files, chatDoc, username) => {
  const imageRef = ref(
    storage,
    `chatFiles/${files[0].name}${shortid.generate()}`
  );
  uploadBytes(imageRef, files[0]).then((snapshot) => {
    getDownloadURL(snapshot.ref).then(async (url) => {
      await updateDoc(chatDoc, {
        messages: arrayUnion({
          author: username,
          type: files[0].type,
          message: url,
          viewed: [username],
          createdAt: firebase.firestore.Timestamp.now(),
        }),
      });
    });
  });
};

const sendTextMessage = async (chatDoc, message, username) => {
  if (message.length > 0) {
    await updateDoc(chatDoc, {
      messages: arrayUnion({
        author: username,
        type: "text",
        message,
        viewed: [username],
        createdAt: firebase.firestore.Timestamp.now(),
      }),
    });
  }
};

export default async (files, user, message, chatId) => {
  const chatDoc = doc(firestore, "chats", chatId);

  if (files) {
    sendFileMessage(files, chatDoc, user.username);
    return;
  }
  sendTextMessage(chatDoc, message, user.username);
};
