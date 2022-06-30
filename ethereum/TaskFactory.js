import web3 from "./web3";
import TaskFactory from "./build/TaskFactory.json";

const address = "0xc9c8192984c47C8Ae233a3C332dC4198b0625B52";

const addressVerificaiton = new web3.eth.Contract(TaskFactory.abi, address);

export default addressVerificaiton;