import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase";
import { IChat } from "../models/chat";
import { IDeveloper, IEmployer } from "../models/user";

export default async (chats: any, user: IDeveloper | IEmployer) => {
    const chatsArr: IChat[] = [];
        return new Promise((res, rej) => {
          chats?.forEach(async (chat, idx) => {
            const userSnap = await getDocs(
              query(
                collection(
                  firestore,
                  user.type === "developers" ? "employers" : "developers"
                ),
                where(
                  "username",
                  "==",
                  chat.members.find(
                    (member: string) => member !== user.username
                  )
                )
              )
            );
            chatsArr.push({
              chat,
              guest: userSnap.docs[0].data() as any,
            });
            if (idx === chats.length - 1) {
              res(chatsArr);
            }
          });
        })
}