import Web3 from "web3";

let web3;

if(typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    window.ethereum.request({ method: "eth_RequestAccounts" });

    web3 = new Web3(window.ethereum);
} else {
    const provider = new Web3.providers.HttpProvider(
        "https://rinkeby.infura.io/v3/371756b52f6147feaf3eee8b1d892800"        
    )
    web3 = new Web3(provider);
}

export default web3;