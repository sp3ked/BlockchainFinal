// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

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
    
    mapping(address => uint256) public userBalances;
    mapping(uint256 => Bet) public bets;
    uint256 public nextBetId;
    
    uint256 public constant BETTING_PERIOD = 1 hours;
    uint256 public constant MIN_BET = 0.01 ether;
    
    event BetPlaced(uint256 betId, address bettor, uint256 amount, bool isDoge);
    event BetSettled(uint256 betId, address bettor, uint256 amount, bool won);
    event Deposit(address user, uint256 amount, uint256 newBalance);
    event Withdrawal(address user, uint256 amount, uint256 newBalance);
    event DebugBalance(address user, uint256 balance, string message);

    constructor(address _dogePriceFeed, address _shibPriceFeed) {
        dogePriceFeed = AggregatorV3Interface(_dogePriceFeed);
        shibPriceFeed = AggregatorV3Interface(_shibPriceFeed);
    }

    function deposit() external payable {
        userBalances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value, userBalances[msg.sender]);
        emit DebugBalance(msg.sender, userBalances[msg.sender], "After deposit");
    }

    function withdraw(uint256 amount) external {
        require(userBalances[msg.sender] >= amount, "Insufficient balance");
        userBalances[msg.sender] -= amount;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        emit Withdrawal(msg.sender, amount, userBalances[msg.sender]);
        emit DebugBalance(msg.sender, userBalances[msg.sender], "After withdrawal");
    }

    function placeBet(bool isDoge, uint256 amount) external {
        require(amount >= MIN_BET, "Bet too small");
        require(userBalances[msg.sender] >= amount, "Insufficient balance");
        emit DebugBalance(msg.sender, userBalances[msg.sender], "Before bet");

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
        emit DebugBalance(msg.sender, userBalances[msg.sender], "After bet placed");
        nextBetId++;
    }

    function settleBet(uint256 betId) external {
        Bet storage bet = bets[betId];
        require(!bet.isSettled, "Bet already settled");
        require(block.timestamp >= bet.startTime + BETTING_PERIOD, "Betting period not over");
        emit DebugBalance(bet.bettor, userBalances[bet.bettor], "Before settlement");

        (uint256 currentDogePrice, uint256 currentShibPrice) = getCurrentPrices();

        uint256 dogePercentChange = ((currentDogePrice * 10000) / bet.startDogePrice) - 10000;
        uint256 shibPercentChange = ((currentShibPrice * 10000) / bet.startShibPrice) - 10000;

        bool dogeWon = dogePercentChange > shibPercentChange;
        bool userWon = (bet.isDoge && dogeWon) || (!bet.isDoge && !dogeWon);

        bet.isSettled = true;

        if (userWon) {
            uint256 payout = bet.amount * 19 / 10; // 1.9x payout
            userBalances[bet.bettor] += payout;
            emit BetSettled(betId, bet.bettor, payout, true);
        } else {
            emit BetSettled(betId, bet.bettor, 0, false);
        }
        
        emit DebugBalance(bet.bettor, userBalances[bet.bettor], "After settlement");
    }

    function getCurrentPrices() public view returns (uint256 dogePrice, uint256 shibPrice) {
        (, int256 dogeAnswer,,,) = dogePriceFeed.latestRoundData();
        (, int256 shibAnswer,,,) = shibPriceFeed.latestRoundData();
        require(dogeAnswer > 0 && shibAnswer > 0, "Invalid price data");
        return (uint256(dogeAnswer), uint256(shibAnswer));
    }

    function getBet(uint256 betId) external view returns (Bet memory) {
        return bets[betId];
    }

    function getBalance() external view returns (uint256) {
        return userBalances[msg.sender];
    }
}