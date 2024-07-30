// src/controller/votingController.js

const Web3 = require('web3');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Initialize web3 provider with Alchemy
const alchemyUrl = process.env.ALCHEMY_URL;
const web3 = new Web3(new Web3.providers.HttpProvider(alchemyUrl));

// Smart contract ABI and address
const contractABI = [
  {
    "constant": false,
    "inputs": [
      { "internalType": "string", "name": "_partyName", "type": "string" }
    ],
    "name": "addParty",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "internalType": "string", "name": "_partyName", "type": "string" },
      { "internalType": "string", "name": "_voterEmail", "type": "string" }
    ],
    "name": "castVote",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "internalType": "string", "name": "_partyName", "type": "string" }
    ],
    "name": "deleteParty",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "string", "name": "partyName", "type": "string" }
    ],
    "name": "PartyAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "string", "name": "partyName", "type": "string" }
    ],
    "name": "PartyDeleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "string", "name": "partyName", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "voterEmail", "type": "string" }
    ],
    "name": "VoteCasted",
    "type": "event"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getAllVoters",
    "outputs": [
      { "internalType": "string[]", "name": "", "type": "string[]" },
      { "internalType": "string[][]", "name": "", "type": "string[][]" }
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
      { "internalType": "string[]", "name": "", "type": "string[]" },
      { "internalType": "uint256[]", "name": "", "type": "uint256[]" }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Function to cast a vote
const castVote = async (req, res) => {
  const { partyName, voterEmail } = req.body;
  if (!partyName || !voterEmail) return res.status(400).json({ error: 'Party name and voter email are required' });

  try {
    const tx = {
      from: process.env.FROM_ADDRESS, // The sender's public key
      gas: 2000000,
      to: contractAddress,
      data: contract.methods.castVote(partyName, voterEmail).encodeABI()
    };

    // Sign and send the transaction
    const signedTx = await web3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    res.json(receipt);
  } catch (error) {
    console.error('Error casting vote:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Function to get all voters
const getVoter = async (req, res) => {
  try {
    const voters = await contract.methods.getAllVoters().call();
    res.status(200).json(voters);
  } catch (err) {
    console.error('Error getting voters:', err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { castVote, getVoter };
