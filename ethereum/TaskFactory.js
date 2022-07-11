import web3 from "./web3";
import TaskFactory from "./build/TaskFactory.json";

const address = "0xc47c07E064275A70606c7C14dD89ca39F832b374";

const addressVerificaiton = new web3.eth.Contract(TaskFactory.abi, address);

export default addressVerificaiton;