const { ethers } = require("hardhat");

async function main() {
    try {
        console.log("Starting deployment and test...");

        // Deploy BettingToken
        console.log("Deploying BettingToken...");
        const BettingToken = await ethers.getContractFactory("BettingToken");
        const bettingToken = await BettingToken.deploy();
        await bettingToken.waitForDeployment();
        console.log("BettingToken deployed to:", await bettingToken.getAddress());

        // Deploy mock price feeds
        console.log("Deploying Mock Price Feeds...");
        const MockV3Aggregator = await ethers.getContractFactory("MockV3Aggregator");
        const mockDogeFeed = await MockV3Aggregator.deploy(8, 100000000);
        const mockShibFeed = await MockV3Aggregator.deploy(8, 1000000);
        await mockDogeFeed.waitForDeployment();
        await mockShibFeed.waitForDeployment();
        console.log("Mock DOGE Feed deployed to:", await mockDogeFeed.getAddress());
        console.log("Mock SHIB Feed deployed to:", await mockShibFeed.getAddress());

        // Deploy MemeBets
        console.log("Deploying MemeBets...");
        const MemeBets = await ethers.getContractFactory("MemeBets");
        const memeBets = await MemeBets.deploy(
            await mockDogeFeed.getAddress(),
            await mockShibFeed.getAddress(),
            await bettingToken.getAddress()
        );
        await memeBets.waitForDeployment();
        console.log("MemeBets deployed to:", await memeBets.getAddress());

        // Get signers
        const [owner] = await ethers.getSigners();
        const user1 = owner;
        console.log("Using owner address:", owner.address);
        console.log("Using user1 address:", user1.address);
        
        // Approve tokens for withdrawal
        console.log("\nApproving tokens for withdrawal...");
        await bettingToken.approve(await memeBets.getAddress(), ethers.parseEther("1000"));

        const contractWithSigner = memeBets.connect(user1);

        //depo
        console.log("\nTesting deposit...");
        const depositAmount = ethers.parseEther("15");
        const depositTx = await contractWithSigner.deposit({ value: depositAmount });
        await depositTx.wait();

        let balance = await contractWithSigner.userBalances(user1.address);
        console.log("Balance after deposit:", ethers.formatEther(balance), "ETH");

        //placing a bet
        const betAmount = ethers.parseEther("10");
        console.log("\nPlacing bet of", ethers.formatEther(betAmount), "ETH");
        const placeBetTx = await contractWithSigner.placeBet(true, betAmount);
        await placeBetTx.wait();

        balance = await contractWithSigner.userBalances(user1.address);
        console.log("Balance after placing bet:", ethers.formatEther(balance), "ETH");

        //update prices
        console.log("\nUpdating prices...");
        await mockDogeFeed.updateAnswer(120000000);
        await mockShibFeed.updateAnswer(1100000);
        console.log("Prices updated: DOGE +20%, SHIB +10%");

        //timeb travel
        console.log("\nAdvancing time...");
        await ethers.provider.send("evm_increaseTime", [3600]);
        await ethers.provider.send("evm_mine");

        //settle bet
        console.log("\nSettling bet...");
        const settleTx = await memeBets.settleBet(0);
        await settleTx.wait();

        balance = await contractWithSigner.userBalances(user1.address);
        console.log("Balance after settlement:", ethers.formatEther(balance), "ETH");

        //withdrawal
        const withdrawAmount = ethers.parseEther("2");
        console.log("\nWithdrawing", ethers.formatEther(withdrawAmount), "ETH");
        const withdrawTx = await contractWithSigner.connect(user1).withdraw(withdrawAmount);
        await withdrawTx.wait();

        balance = await contractWithSigner.userBalances(user1.address);
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