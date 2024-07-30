// src/controller/votingController.js

const Web3 = require('web3');
require('dotenv').config();

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ALCHEMY_URL));
const contractABI = [
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "string",
        "name": "_partyName",
        "type": "string"
      }
    ],
    "name": "addParty",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "string",
        "name": "_partyName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_voterEmail",
        "type": "string"
      }
    ],
    "name": "castVote",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "string",
        "name": "_partyName",
        "type": "string"
      }
    ],
    "name": "deleteParty",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "partyName",
        "type": "string"
      }
    ],
    "name": "PartyAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "partyName",
        "type": "string"
      }
    ],
    "name": "PartyDeleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "partyName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "voterEmail",
        "type": "string"
      }
    ],
    "name": "VoteCasted",
    "type": "event"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getAllVoters",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      },
      {
        "internalType": "string[][]",
        "name": "",
        "type": "string[][]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getAllVotes",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(contractABI, contractAddress);

const addParty = async (req, res) => {
    const { partyName } = req.body;
    if (!partyName) return res.status(400).json({ error: 'Party name is required' });
  
    try {
      const accounts = await web3.eth.getAccounts();
  
      const tx = {
        from: process.env.FROM_ADDRESS, // The sender's public key
        gas: 2000000,
        to: contractAddress,
        data: contract.methods.addParty(partyName).encodeABI()
      };
  
      // Sign and send the transaction
      const signedTx = await web3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  
      res.json(receipt);
    } catch (error) {
      console.error('Error adding party:', error.message);
      res.status(500).json({ error: error.message });
    }
  };

// Function to delete a party
// Function to delete a party
const deleteParty = async (req, res) => {
    const { partyName } = req.body;
    if (!partyName) return res.status(400).json({ error: 'Party name is required' });
  
    try {
      const accounts = await web3.eth.getAccounts();
  
      const tx = {
        from:process.env.FROM_ADDRESS , // The sender's public key
        gas: 2000000,
        to: contractAddress,
        data: contract.methods.deleteParty(partyName).encodeABI()
      };
  
      // Sign and send the transaction
      const signedTx = await web3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  
      res.json(receipt);
    } catch (error) {
      console.error('Error deleting party:', error.message);
      res.status(500).json({ error: error.message });
    }
  };
  

// Function to get all votes
const getParty = async (req, res) => {
  try {
    const result = await contract.methods.getAllVotes().call(); // Adjusted to getAllVotes method
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addParty, deleteParty, getParty };
