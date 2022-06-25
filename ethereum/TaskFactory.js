import web3 from "./web3";
import { abi } from "./build/TaskFactory.json";

const address = "0x32abF6Db843dc6b95C5349701fc5e06638569cE6";

const addressVerificaiton = new web3.eth.Contract(abi, address);

export default addressVerificaiton;