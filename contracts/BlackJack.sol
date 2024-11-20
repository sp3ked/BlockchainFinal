// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Blackjack is VRFConsumerBaseV2, Ownable {
    VRFCoordinatorV2Interface COORDINATOR;

    // Sepolia VRF Coordinator
    address vrfCoordinator = 0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625;
    bytes32 keyHash = 0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c;
    
    uint64 public subscriptionId;
    uint32 callbackGasLimit = 100000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 1;

    // Game state
    mapping(uint256 => address) public requestToPlayer;
    mapping(address => uint256[]) public playerCards;
    mapping(address => uint256[]) public dealerCards;
    mapping(address => bool) public gameInProgress;

    event CardDealt(address indexed player, uint256 card, bool isPlayer);
    event GameStarted(address indexed player);
    event GameEnded(address indexed player, string result);

    constructor(uint64 _subscriptionId) VRFConsumerBaseV2(vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        subscriptionId = _subscriptionId;
    }

    function startGame() public {
        require(!gameInProgress[msg.sender], "Game already in progress");
        delete playerCards[msg.sender];
        delete dealerCards[msg.sender];
        gameInProgress[msg.sender] = true;
        
        // Deal initial cards
        requestCards(true); // Player card 1
        requestCards(false); // Dealer card 1
        requestCards(true); // Player card 2
        
        emit GameStarted(msg.sender);
    }

    function requestCards(bool isPlayer) internal {
        uint256 requestId = COORDINATOR.requestRandomWords(
            keyHash,
            subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        requestToPlayer[requestId] = msg.sender;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        address player = requestToPlayer[requestId];
        uint256 card = (randomWords[0] % 13) + 1; // Cards from 1-13
        
        if (playerCards[player].length < dealerCards[player].length) {
            playerCards[player].push(card);
            emit CardDealt(player, card, true);
        } else {
            dealerCards[player].push(card);
            emit CardDealt(player, card, false);
        }
    }

    function hit() public {
        require(gameInProgress[msg.sender], "No game in progress");
        require(getHandValue(playerCards[msg.sender]) < 21, "You already busted!");
        
        requestCards(true);
    }

    function stand() public {
        require(gameInProgress[msg.sender], "No game in progress");
        
        // Dealer draws cards until 17 or higher
        while (getHandValue(dealerCards[msg.sender]) < 17) {
            requestCards(false);
        }
        
        endGame();
    }

    function getHandValue(uint256[] memory hand) public pure returns (uint256) {
        uint256 value = 0;
        uint256 aces = 0;
        
        for (uint256 i = 0; i < hand.length; i++) {
            uint256 card = hand[i];
            if (card == 1) { // Ace
                aces++;
                value += 11;
            } else if (card > 10) { // Face cards
                value += 10;
            } else {
                value += card;
            }
        }
        
        // Adjust for aces
        while (value > 21 && aces > 0) {
            value -= 10;
            aces--;
        }
        
        return value;
    }

    function endGame() internal {
        uint256 playerValue = getHandValue(playerCards[msg.sender]);
        uint256 dealerValue = getHandValue(dealerCards[msg.sender]);
        
        if (playerValue > 21) {
            emit GameEnded(msg.sender, "Bust! Dealer wins!");
        } else if (dealerValue > 21) {
            emit GameEnded(msg.sender, "Dealer bust! You win!");
        } else if (playerValue > dealerValue) {
            emit GameEnded(msg.sender, "You win!");
        } else if (dealerValue > playerValue) {
            emit GameEnded(msg.sender, "Dealer wins!");
        } else {
            emit GameEnded(msg.sender, "Push!");
        }
        
        gameInProgress[msg.sender] = false;
    }

    function getPlayerCards(address player) public view returns (uint256[] memory) {
        return playerCards[player];
    }

    function getDealerCards(address player) public view returns (uint256[] memory) {
        return dealerCards[player];
    }
}