import web3 from "./web3";
import TaskFactory from "./build/TaskFactory.json";

const address = "0xa03389C72917F64909fe8529b99a2af384Add33d";

const addressVerificaiton = new web3.eth.Contract(TaskFactory.abi, address);

export default addressVerificaiton;