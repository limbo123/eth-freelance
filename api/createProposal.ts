import { IEmployer } from './../models/user';
import web3 from "../ethereum/web3";
import taskObj from "../ethereum/build/Task.json";
import { IDeveloper } from "../models/user";


export default async (proposalText: string, user: IDeveloper | IEmployer, taskAddress: string) => {
    console.log(user.address);
    const currentTask = await new web3.eth.Contract(
        taskObj.abi,
        taskAddress
      );
      try {
        await currentTask.methods.creaetRequest(proposalText).send({
          from: user.address
        })
      } catch (error: any) {
        if(error.code === -32602) {
          console.log("You must be logged in metamask at correct account");
        }
      }
}