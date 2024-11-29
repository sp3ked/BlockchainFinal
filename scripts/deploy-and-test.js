const { ethers } = require("hardhat");

async function main() {
    try {
        console.log("Starting deployment and test...");

        // Deploy mock price feeds
        const MockV3Aggregator = await ethers.getContractFactory("MockV3Aggregator");
        console.log("Deploying Mock Price Feeds...");

        const mockDogeFeed = await MockV3Aggregator.deploy(8, 100000000); // DOGE initial price ($1.00)
        const mockShibFeed = await MockV3Aggregator.deploy(8, 1000000);   // SHIB initial price ($0.01)

        await mockDogeFeed.waitForDeployment();
        await mockShibFeed.waitForDeployment();

        console.log("Mock DOGE Feed deployed to:", await mockDogeFeed.getAddress());
        console.log("Mock SHIB Feed deployed to:", await mockShibFeed.getAddress());

        // Deploy the main MemeBets contract
        const MemeBets = await ethers.getContractFactory("MemeBets");
        const memeBets = await MemeBets.deploy(
            await mockDogeFeed.getAddress(),
            await mockShibFeed.getAddress()
        );
        await memeBets.waitForDeployment();

        console.log("MemeBets deployed to:", await memeBets.getAddress());

        // Get signers
        const [owner] = await ethers.getSigners();
        const user1 = owner; // Use the same account for simplicity
        console.log("Using owner address:", owner.address);
        console.log("Using user1 address:", user1.address);

        // Interact with the contract using the signer
        const contractWithSigner = memeBets.connect(user1);

        // Deposit funds
        console.log("\nTesting deposit...");
        const depositAmount = ethers.parseEther("0.05"); // Reduced to 0.05 ETH
        const depositTx = await contractWithSigner.deposit({ value: depositAmount });
        await depositTx.wait();

        let balance = await contractWithSigner.getBalance();
        console.log("Balance after deposit:", ethers.formatEther(balance), "ETH");

        // Test placing a bet
        const betAmount = ethers.parseEther("0.01"); // Reduced to 0.01 ETH
        console.log("\nPlacing bet of", ethers.formatEther(betAmount), "ETH");
        const placeBetTx = await contractWithSigner.placeBet(true, betAmount);
        await placeBetTx.wait();

        balance = await contractWithSigner.getBalance();
        console.log("Balance after placing bet:", ethers.formatEther(balance), "ETH");

        // Update prices
        console.log("\nUpdating prices...");
        await mockDogeFeed.updateAnswer(120000000); // DOGE +20%
        await mockShibFeed.updateAnswer(1100000);   // SHIB +10%
        console.log("Prices updated: DOGE +20%, SHIB +10%");

        // Fast forward time
        console.log("\nAdvancing time...");
        await ethers.provider.send("evm_increaseTime", [3600]); // Increase time by 1 hour
        await ethers.provider.send("evm_mine");

        // Settle bet
        console.log("\nSettling bet...");
        const settleTx = await memeBets.settleBet(0); // Settle the first bet
        await settleTx.wait();
        
        balance = await memeBets.connect(user1).getBalance();
        console.log("Balance after settlement:", ethers.formatEther(balance), "ETH");

        // Test withdrawal
        const withdrawAmount = ethers.parseEther("0.02"); // Withdraw 0.02 ETH
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
