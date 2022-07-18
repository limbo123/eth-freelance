import web3 from "./web3";
import TaskFactory from "./build/TaskFactory.json";

const address = "0xf43a8347e4D21aA8501746B5EA8be96E1ED8F9a1";

const addressVerificaiton = new web3.eth.Contract(TaskFactory.abi, address);

export default addressVerificaiton;