const fs = require("fs-extra");
const path = require("path");
const solc = require("solc");

const buildFolderPath = path.resolve(__dirname, "build");
fs.removeSync(buildFolderPath);

const taskPath = path.resolve(__dirname, "contracts", "Task.sol");
const addressVerifPath = path.resolve(
  __dirname,
  "contracts",
  "AddressVerification.sol"
);

const taskSource = fs.readFileSync(taskPath, "utf8");
const addresVerifSource = fs.readFileSync(addressVerifPath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "Task.sol": {
      content: taskSource,
    },
    "AddressVerification.sol": {
      content: addresVerifSource,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const compiledOutput = JSON.parse(solc.compile(JSON.stringify(input)));
console.log(compiledOutput.contracts);

fs.ensureDirSync(buildFolderPath);

Object.keys(compiledOutput.contracts).forEach((fileName) => {
  Object.keys(compiledOutput.contracts[fileName]).forEach((contractName) => {
    fs.outputJsonSync(
      path.resolve(buildFolderPath, `${contractName}.json`),
      compiledOutput.contracts[fileName][contractName]
    );
  });
});
