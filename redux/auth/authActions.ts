import { IEmployer, IDeveloper } from './../../models/user';
import { userSlice } from "./authSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, query, where } from "firebase/firestore";
import shortid from "shortid";
import { firestore, storage } from "../../firebase";
import { useForceUpdate } from '@react-spring/shared';

interface userInfo {
  email: string;
  password: string;
}

export const registerUser = createAsyncThunk(
  "user/register",
  async (userData: IDeveloper | IEmployer, thunkAPI) => {
    try {
      const usersCollection = collection(firestore, userData.type);
      let anotherTypeCollection;
      if(userData.type === "employers") {
        anotherTypeCollection = collection(firestore, "developers")
      } else {
        anotherTypeCollection = collection(firestore, "employers");
      }

      const identicalEmailRef = query(
        usersCollection,
        where("email", "==", userData.email)
      );
      const identicalUsernameRef = query(
        usersCollection,
        where("username", "==", userData.username)
      );
      const usernameInAnotherTypeRef = query(
        anotherTypeCollection,
        where("username", "==", userData.username)
      );
      const emailInAnotherTypeRef = query(
        anotherTypeCollection,
        where("email", "==", userData.email)
      );
      const identicalAddressRef = query(
        usersCollection,
        where("address", "==", userData.address)
      );

      const identicalEmailDocs = await getDocs(identicalEmailRef);
      const identicalUsernameDocs = await getDocs(identicalUsernameRef);
      const identicalAddressDocs = await getDocs(identicalAddressRef);
      const anotherTypeUsernameDocs = await getDocs(usernameInAnotherTypeRef);
      const anotherTypeEmailDocs = await getDocs(emailInAnotherTypeRef);


      if (identicalEmailDocs.docs.length > 0) {
        return thunkAPI.rejectWithValue(
          "This email is already used in another account. Try another"
        );
      }
      if (anotherTypeEmailDocs.docs.length > 0) {
        return thunkAPI.rejectWithValue(
          "This email is already used. Try another"
        );
      }
      if (identicalUsernameDocs.docs.length > 0) {
        return thunkAPI.rejectWithValue(
          "This username is already used. Try another"
        );
      }
      if (anotherTypeUsernameDocs.docs.length > 0) {
        return thunkAPI.rejectWithValue(
          "This username is already used. Try another"
        );
      }

      if (identicalAddressDocs.docs.length > 0) {
        return thunkAPI.rejectWithValue(
          "This address is already used. Use another"
        );
      }

      const imageName = shortid.generate();
      const uploadTask = storage
        .ref(`profileImages/${imageName}.jpg`)
        .put(userData.profilePhoto as ArrayBuffer | Uint8Array | Blob);
      uploadTask.on(
        "state_changed",
        () => {},
        () => {},
        () => {
          storage
            .ref(`profileImages/${imageName}.jpg`)
            .getDownloadURL()
            .then((imageUrl) => {
              console.log(typeof userData);
              const userLayout = {
                address: userData.address,
                description: userData.description,
                email: userData.email,
                password: userData.password,
                profilePhoto: imageUrl,
                rating: 0,
                username: userData.username,
              };
              let newUser;
              if(userData.type === "developers") {
                newUser = {...userLayout, completedTasks: []}
              } else {
                newUser = {...userLayout, createdTasks: [], moneysSpent: 0}
              }
              firestore
                .collection(userData.type)
                .doc(userData.username)
                .set(newUser)
                .then(() => {
                  return newUser;
                });
            });
        }
      );
    } catch (error) {
      return thunkAPI.rejectWithValue("error message");
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (userInfo: userInfo, thunkAPI) => {
    try {
      let currentUser;
      const developersRef = collection(firestore, "developers");
      const currentUserRef = query(
        developersRef,
        where("email", "==", userInfo.email)
      );
      const developersSnap = await getDocs(currentUserRef);

      developersSnap.forEach((doc) => {
        currentUser = doc.data();
      });

      if (currentUser) {
        if (currentUser.password === userInfo.password) {
          return currentUser;
        }
        return thunkAPI.rejectWithValue("Incorrect password");
      } else {
        const employersRef = collection(firestore, "employers");
        const currentUserRef = query(
          employersRef,
          where("email", "==", userInfo.email)
        );
        const employersSnap = await getDocs(currentUserRef);

        employersSnap.forEach((doc) => {
          currentUser = doc.data();
        });
        if (currentUser) {
          if (currentUser.password === userInfo.password) {
            return currentUser;
          }
          return thunkAPI.rejectWithValue("Incorrect password");
        }
        return thunkAPI.rejectWithValue(
          "we cannot found account with this email. Try another"
        );
      }
    } catch (error) {
      return thunkAPI.rejectWithValue("error message");
    }
  }
);
