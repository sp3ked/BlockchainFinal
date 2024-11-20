// Copy your contract ABI here
const BlackjackABI = {
    "abi": [
      {
        "inputs": [
          {
            "internalType": "uint64",
            "name": "_subscriptionId",
            "type": "uint64"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [],
        "name": "startGame",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "hit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "stand",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
      // Add all other functions from your ABI
    ]
  };
  
  export default BlackjackABI;