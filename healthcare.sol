// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract HealthcareRecords {
    address owner;

    struct Record {
        uint256 recordID;
        string patientName;
        string diagnosis;
        string treatment;
        uint256 timestamp;
    }

    mapping (uint256 => Record[]) private patientRecords; // for store the patient record

    mapping (address => bool) private authorizedProviders; // verify the authorization of a provider

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this function"); 
        _; // if we apply this to a function its means that only owner can call the function
    }

    modifier onlyAuthorizedProvider() {
        require(authorizedProviders[msg.sender], "Not an authorized provider");
        _; // make sure that only these patients who are registered in the smart contract can call the addRecord function
    }

    constructor() {
        owner = msg.sender; // initialize the owner after deloy the contract
    }

    function getOwner() public view returns (address) {
        return  owner; // return the adress of the owner
    }

    function authorizeProvider (address provider) public onlyOwner {
        authorizedProviders[provider] = true; // give the authorization to a provider
    }

    // add Record function that add a new rcord to patientRecords, only authorized providers can run this function
    function addRecord(uint256 patientID,string memory patientName, string memory diagnosis, string memory treatment) public onlyAuthorizedProvider {
        uint256 recordID = patientRecords[patientID].length + 1;
        patientRecords[patientID].push(Record(recordID, patientName, diagnosis, treatment, block.timestamp));
    }

    // return a Patient Record, only authorized providers can run this function
    function getPatientRecords(uint256 patientID) public view onlyAuthorizedProvider returns (Record[] memory) {
        return patientRecords[patientID];
    }


}
 
// contract address : 0x0498B7c793D7432Cd9dB27fb02fc9cfdBAfA1Fd3

// abi : 
// [
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "patientID",
// 				"type": "uint256"
// 			},
// 			{
// 				"internalType": "string",
// 				"name": "patientName",
// 				"type": "string"
// 			},
// 			{
// 				"internalType": "string",
// 				"name": "diagnosis",
// 				"type": "string"
// 			},
// 			{
// 				"internalType": "string",
// 				"name": "treatment",
// 				"type": "string"
// 			}
// 		],
// 		"name": "addRecord",
// 		"outputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "address",
// 				"name": "provider",
// 				"type": "address"
// 			}
// 		],
// 		"name": "authorizeProvider",
// 		"outputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "constructor"
// 	},
// 	{
// 		"inputs": [],
// 		"name": "getOwner",
// 		"outputs": [
// 			{
// 				"internalType": "address",
// 				"name": "",
// 				"type": "address"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "patientID",
// 				"type": "uint256"
// 			}
// 		],
// 		"name": "getPatientRecords",
// 		"outputs": [
// 			{
// 				"components": [
// 					{
// 						"internalType": "uint256",
// 						"name": "recordID",
// 						"type": "uint256"
// 					},
// 					{
// 						"internalType": "string",
// 						"name": "patientName",
// 						"type": "string"
// 					},
// 					{
// 						"internalType": "string",
// 						"name": "diagnosis",
// 						"type": "string"
// 					},
// 					{
// 						"internalType": "string",
// 						"name": "treatment",
// 						"type": "string"
// 					},
// 					{
// 						"internalType": "uint256",
// 						"name": "timestamp",
// 						"type": "uint256"
// 					}
// 				],
// 				"internalType": "struct HealthcareRecords.Record[]",
// 				"name": "",
// 				"type": "tuple[]"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	}
// ]
