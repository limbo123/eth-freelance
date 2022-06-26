import web3 from "./web3";
import TaskFactory from "./build/TaskFactory.json";

const address = "0x0d111637e3BC89B13Ed0651d2B8e849cA1e65cb1";

const addressVerificaiton = new web3.eth.Contract(TaskFactory.abi, address);

export default addressVerificaiton;