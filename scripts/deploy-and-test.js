const { ethers } = require("hardhat");

async function main() {
    try {
        console.log("Starting deployment and test...");

        const MockV3Aggregator = await ethers.getContractFactory("MockV3Aggregator");
        console.log("Deploying Mock Price Feeds...");
        
        const mockDogeFeed = await MockV3Aggregator.deploy(8, 100000000);
        const mockShibFeed = await MockV3Aggregator.deploy(8, 1000000);
        
        await mockDogeFeed.waitForDeployment();
        await mockShibFeed.waitForDeployment();
        
        console.log("Mock DOGE Feed deployed to:", await mockDogeFeed.getAddress());
        console.log("Mock SHIB Feed deployed to:", await mockShibFeed.getAddress());

        const MemeBets = await ethers.getContractFactory("MemeBets");
        const memeBets = await MemeBets.deploy(
            await mockDogeFeed.getAddress(),
            await mockShibFeed.getAddress()
        );
        await memeBets.waitForDeployment();
        
        console.log("MemeBets deployed to:", await memeBets.getAddress());

        const [owner, user1] = await ethers.getSigners();
        console.log("Testing with user address:", user1.address);

        // Test deposit
        console.log("\nTesting deposit...");
        const depositAmount = ethers.parseEther("1.0");
        const depositTx = await memeBets.connect(user1).deposit({ value: depositAmount });
        const depositReceipt = await depositTx.wait();
        
        let balance = await memeBets.connect(user1).getBalance();
        console.log("Initial balance after deposit:", ethers.formatEther(balance), "ETH");
        
        if (balance !== depositAmount) {
            throw new Error("Deposit amount mismatch");
        }

        // Test placing bet
        const betAmount = ethers.parseEther("0.1");
        console.log("\nPlacing bet of", ethers.formatEther(betAmount), "ETH");
        const placeBetTx = await memeBets.connect(user1).placeBet(true, betAmount);
        await placeBetTx.wait();
        
        balance = await memeBets.connect(user1).getBalance();
        console.log("Balance after placing bet:", ethers.formatEther(balance), "ETH");

        // Update prices
        console.log("\nUpdating prices...");
        await mockDogeFeed.updateAnswer(120000000);
        await mockShibFeed.updateAnswer(1100000);
        console.log("Prices updated: DOGE +20%, SHIB +10%");

        // Fast forward time
        console.log("\nAdvancing time...");
        await ethers.provider.send("evm_increaseTime", [3600]);
        await ethers.provider.send("evm_mine");

        // Settle bet
        console.log("\nSettling bet...");
        const settleTx = await memeBets.settleBet(0);
        await settleTx.wait();
        
        balance = await memeBets.connect(user1).getBalance();
        console.log("Balance after settlement:", ethers.formatEther(balance), "ETH");

        // Test withdrawal
        const withdrawAmount = ethers.parseEther("0.5");
        console.log("\nWithdrawing", ethers.formatEther(withdrawAmount), "ETH");
        const withdrawTx = await memeBets.connect(user1).withdraw(withdrawAmount);
        await withdrawTx.wait();
        
        balance = await memeBets.connect(user1).getBalance();
        console.log("Final balance:", ethers.formatEther(balance), "ETH");

    } catch (error) {
        console.error("Error occurred:", error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });