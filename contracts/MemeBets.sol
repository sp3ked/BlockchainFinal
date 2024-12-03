// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./BettingToken.sol";

contract MemeBets {
    struct Bet {
        address bettor;
        uint256 amount;
        bool isDoge;
        uint256 startTime;
        uint256 startDogePrice;
        uint256 startShibPrice;
        bool isSettled;
    }

    AggregatorV3Interface private dogePriceFeed;
    AggregatorV3Interface private shibPriceFeed;
    BettingToken private token;

    mapping(address => uint256) public userBalances;
    mapping(uint256 => Bet) public bets;
    uint256 public nextBetId;

    uint256 public constant BETTING_PERIOD = 1 hours;
    uint256 public constant MIN_BET = 10 * 10 ** 18; // 10 BET tokens

    event BetPlaced(uint256 betId, address bettor, uint256 amount, bool isDoge);
    event BetSettled(uint256 betId, address bettor, uint256 amount, bool won);
    event Deposit(address indexed user, uint256 amount, uint256 newBalance);  // Added Deposit event

    constructor(
        address _dogePriceFeed,
        address _shibPriceFeed,
        address _tokenAddress
    ) {
        dogePriceFeed = AggregatorV3Interface(_dogePriceFeed);
        shibPriceFeed = AggregatorV3Interface(_shibPriceFeed);
        token = BettingToken(_tokenAddress);
    }
    
    function deposit() external payable {
        userBalances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value, userBalances[msg.sender]);
    }

    function withdraw(uint256 amount) external {
    require(userBalances[msg.sender] >= amount, "Insufficient balance");
    userBalances[msg.sender] -= amount;
    (bool success, ) = payable(msg.sender).call{value: amount}("");
    require(success, "ETH transfer failed");
}

    function placeBet(bool isDoge, uint256 amount) external {
        require(amount >= MIN_BET, "Bet too small");
        require(userBalances[msg.sender] >= amount, "Insufficient balance");

        (uint256 dogePrice, uint256 shibPrice) = getCurrentPrices();

        userBalances[msg.sender] -= amount;

        bets[nextBetId] = Bet({
            bettor: msg.sender,
            amount: amount,
            isDoge: isDoge,
            startTime: block.timestamp,
            startDogePrice: dogePrice,
            startShibPrice: shibPrice,
            isSettled: false
        });

        emit BetPlaced(nextBetId, msg.sender, amount, isDoge);
        nextBetId++;
    }

    function settleBet(uint256 betId) external {
        Bet storage bet = bets[betId];
        require(!bet.isSettled, "Bet already settled");
        require(block.timestamp >= bet.startTime + BETTING_PERIOD, "Betting period not over");

        (uint256 currentDogePrice, uint256 currentShibPrice) = getCurrentPrices();

        uint256 dogePercentChange = ((currentDogePrice * 10000) / bet.startDogePrice) - 10000;
        uint256 shibPercentChange = ((currentShibPrice * 10000) / bet.startShibPrice) - 10000;

        bool dogeWon = dogePercentChange > shibPercentChange;
        bool userWon = (bet.isDoge && dogeWon) || (!bet.isDoge && !dogeWon);

        bet.isSettled = true;

        if (userWon) {
            uint256 payout = bet.amount * 19 / 10; // 1.9x payout
            userBalances[bet.bettor] += payout;
        }

        emit BetSettled(betId, bet.bettor, userBalances[bet.bettor], userWon);
    }

    function getCurrentPrices() public view returns (uint256 dogePrice, uint256 shibPrice) {
        (, int256 dogeAnswer,,,) = dogePriceFeed.latestRoundData();
        (, int256 shibAnswer,,,) = shibPriceFeed.latestRoundData();
        require(dogeAnswer > 0 && shibAnswer > 0, "Invalid price data");
        return (uint256(dogeAnswer), uint256(shibAnswer));
    }
}