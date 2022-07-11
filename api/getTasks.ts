import { IDeveloper } from "./../models/user";
import TaskFactory from "../ethereum/TaskFactory";
import web3 from "../ethereum/web3";
import taskContractInfo from "../ethereum/build/Task.json";
import { ITask } from "../models/task";
import { IEmployer } from "../models/user";

export default async (user: IDeveloper | IEmployer) => {
    // console.log(user);
  const allTasks: any = [];

  const allTasksAddresses = await TaskFactory.methods.getAllTasks().call();

    return new Promise((res, rej) => {
        allTasksAddresses.map(async (address, idx, arr) => {
            const taskContract = await new web3.eth.Contract(
              taskContractInfo.abi,
              address
            );
        
            const task = await taskContract.methods.getInfo().call();
        
            if (user.type === "developers") {
              if (task["4"] === user.sphere && +task["5"] === 0) {
                const taskObj: ITask = {
                  manager: task["0"],
                  title: task["1"],
                  files: task["2"],
                  description: task["3"],
                  sphere: task["4"],
                  worker: task["5"],
                  isCompleted: task["6"],
                  requestsKeys: task["7"],
                  address,
                  price: task["8"],
                };
                allTasks.push(taskObj);
              }
            } else {
              if (task["0"] === user.address) {
                const taskObj: ITask = {
                  manager: task["0"],
                  title: task["1"],
                  files: task["2"],
                  description: task["3"],
                  sphere: task["4"],
                  worker: task["5"],
                  isCompleted: task["6"],
                  requestsKeys: task["7"],
                  address,
                  price: task["8"],
                };
                allTasks.push(taskObj);
              }
            }
            if (idx === arr.length - 1) {
                console.log("before", allTasks);
                res(allTasks);
            }
          });
    });
};
