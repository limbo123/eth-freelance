// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract TaskFactory {
    address[] public allTasks;

    function createTask(string memory header, string memory description, string[] memory hashtags) public payable returns(address) {
        Task newTask = new Task{value: msg.value}(header, description, hashtags, msg.sender);
        address taskAddress = address(newTask);
        allTasks.push(taskAddress);
        return taskAddress;
    }

    function getAllTasks() public view returns(address[] memory) {
        return allTasks;
    }
}


contract Task {

    struct Request {
        string description;
        bool exist;
    }

    address payable public manager;
    string public taskName;
    string public taskDescription;
    string[] public taskHashtags;
    address payable public worker;
    bool public isCompleted;
    mapping(address => Request) public requests;


    constructor(string memory header, string memory description, string[] memory hashtags, address newManager) payable {
        manager = payable(newManager);
        taskName = header;
        taskDescription = description; 
        taskHashtags = hashtags;
        isCompleted = false;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function getHashtags() public view returns(string[] memory) {
        return taskHashtags;
    }

    function killTask() public restricted {
        require(worker == address(0)); 
        manager.transfer(address(this).balance);
    }

    function creaetRequest(string memory description) public  {
        requests[msg.sender] = Request(
            description, true
        );
    }

    function startTask(address newWorker) public restricted {
        require(requests[newWorker].exist);
        worker = payable(newWorker);
    }

    function finalizeTask () public restricted {
        worker.transfer(address(this).balance);
        isCompleted = true;
    }
}


