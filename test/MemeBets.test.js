const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MemeBets", function () {
    let MemeBets;
    let memeBets;
    let owner;
    let addr1;
    let addr2;
    let mockDogeFeed;
    let mockShibFeed;

    beforeEach(async function () {
        // Deploy mock price feeds first
        const MockV3Aggregator = await ethers.getContractFactory("MockV3Aggregator");
        mockDogeFeed = await MockV3Aggregator.deploy(8, 100000000); // $1.00 initial price
        mockShibFeed = await MockV3Aggregator.deploy(8, 1000000);   // $0.01 initial price

        // Deploy main contract
        MemeBets = await ethers.getContractFactory("MemeBets");
        [owner, addr1, addr2] = await ethers.getSigners();
        memeBets = await MemeBets.deploy(mockDogeFeed.getAddress(), mockShibFeed.getAddress());
    });

    describe("Betting", function () {
        const betAmount = ethers.parseEther("0.1");

        beforeEach(async function () {
            // Deposit some ETH first
            await memeBets.connect(addr1).deposit({ value: betAmount });
        });

        it("Should allow placing bets", async function () {
            await expect(memeBets.connect(addr1).placeBet(true, betAmount))
                .to.emit(memeBets, "BetPlaced")
                .withArgs(0, addr1.address, betAmount, true);
        });

        it("Should settle bets correctly when DOGE wins", async function () {
            await memeBets.connect(addr1).placeBet(true, betAmount);
            
            // Update prices to make DOGE win
            await mockDogeFeed.updateAnswer(120000000); // 20% increase
            await mockShibFeed.updateAnswer(1100000);   // 10% increase

            // Fast forward time
            await ethers.provider.send("evm_increaseTime", [3600]);
            await ethers.provider.send("evm_mine");

            await expect(memeBets.settleBet(0))
                .to.emit(memeBets, "BetSettled")
                .withArgs(0, addr1.address, betAmount * 19n / 10n, true);
        });
    });
});