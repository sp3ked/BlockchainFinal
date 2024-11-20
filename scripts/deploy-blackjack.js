const hre = require("hardhat");

async function main() {
  const subscriptionId = 8785; // Your VRF subscription ID
  
  console.log("Deploying Blackjack contract...");

  const Blackjack = await hre.ethers.getContractFactory("Blackjack");
  const blackjack = await Blackjack.deploy(subscriptionId);

  await blackjack.waitForDeployment();
  const address = await blackjack.getAddress();
  
  console.log(`Blackjack deployed to: ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });