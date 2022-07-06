import web3 from "./web3";
import TaskFactory from "./build/TaskFactory.json";

const address = "0x15537b72e0ea218723ea234b72B39bC9a4E2ABc3";

const addressVerificaiton = new web3.eth.Contract(TaskFactory.abi, address);

export default addressVerificaiton;