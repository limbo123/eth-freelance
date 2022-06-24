import web3 from "./web3";
import { abi } from "./build/AddressVerification.json";

const address = "0x0FA208D6F745c3eCfe921CFD13dF00553A6bd926";

const addressVerificaiton = new web3.eth.Contract(abi, address);

export default addressVerificaiton;