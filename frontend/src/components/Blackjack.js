// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract meme is Ownable {
    AggregatorV3Interface internal priceFeedDOGE;
    AggregatorV3Interface internal priceFeedSHIB;

    struct Bet {
        address bettor;
        uint256 amount;
        string coin; // "DOGE" or "SHIB"
    }

    Bet[] public bets;

    constructor(address _dogeFeed, address _shibFeed) {
        priceFeedDOGE = AggregatorV3Interface(_dogeFeed);
        priceFeedSHIB = AggregatorV3Interface(_shibFeed);
    }

    function placeBet(string memory _coin) public payable {
        require(msg.value > 0, "Must place a bet greater than 0");
        require(keccak256(bytes(_coin)) == keccak256(bytes("DOGE")) || keccak256(bytes(_coin)) == keccak256(bytes("SHIB")), "Invalid coin");
        
        bets.push(Bet({
            bettor: msg.sender,
            amount: msg.value,
            coin: _coin
        }));
    }

    function getLatestPriceDOGE() public view returns (int) {
        (, int price, , , ) = priceFeedDOGE.latestRoundData();
        return price;
    }

    function getLatestPriceSHIB() public view returns (int) {
        (, int price, , , ) = priceFeedSHIB.latestRoundData();
        return price;
    }
    
    // Function to determine the winner based on price change
    function determineWinner() public view returns (string memory winner) {
        int dogePrice = getLatestPriceDOGE();
        int shibPrice = getLatestPriceSHIB();
        
        // Logic to determine winner based on price change (simplified)
        if (dogePrice > shibPrice) {
            return "DOGE";
        } else {
            return "SHIB";
        }
    }
}
