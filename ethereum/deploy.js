const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
// const { abi, evm } = require("./build/AddressVerification.json");
const { abi, evm } = require("./build/TaskFactory.json");
console.log(abi);

const provider = new HDWalletProvider(
  "secret spell ring maple glad coach come aisle armed slogan print barely",
  "https://rinkeby.infura.io/v3/371756b52f6147feaf3eee8b1d892800"
);

const web3 = new Web3(provider);

(async() => {
    const accounts = await web3.eth.getAccounts();
    const result = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object })
    .send({ gas: "10000000", from: accounts[0] })
    // const result = await new web3.eth.Contract(abi)
    // .deploy({ data: evm.bytecode.object })
    // .send({ gas: "1000000", from: accounts[0] });
    console.log(result.options.address);
    provider.engine.stop();
})()

