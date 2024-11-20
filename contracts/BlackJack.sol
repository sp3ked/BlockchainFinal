// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Blackjack is VRFConsumerBaseV2, Ownable {
    VRFCoordinatorV2Interface COORDINATOR;

    uint64 subscriptionId;
    address vrfCoordinator = 0xYourVrfCoordinatorAddress; // Replace with the VRF Coordinator address for your network
    bytes32 keyHash = 0xYourKeyHash; // Replace with your Chainlink VRF key hash
    uint32 callbackGasLimit = 100000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 1;

    mapping(uint256 => address) public requestToPlayer;
    mapping(address => uint256[]) public playerCards;

    event CardDealt(address indexed player, uint256 card);

    constructor(uint64 _subscriptionId) VRFConsumerBaseV2(vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        subscriptionId = _subscriptionId;
    }

    function drawCard() public {
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
        uint256 card = (randomWords[0] % 52) + 1; // Random card from 1 to 52
        playerCards[player].push(card);
        emit CardDealt(player, card);
    }

    function getPlayerCards(address player) public view returns (uint256[] memory) {
        return playerCards[player];
    }
}
