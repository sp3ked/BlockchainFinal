const hre = require("hardhat");

async function main() {
  try {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Use the exact name of your contract as defined in the .sol file
    const Token = await hre.ethers.getContractFactory("MemeToken");
    console.log("Deploying MemeToken...");
    const token = await Token.deploy();

    console.log("Waiting for deployment transaction...");
    await token.deploymentTransaction().wait();

    const deployedAddress = await token.getAddress();
    console.log("MemeToken deployed to:", deployedAddress);

  } catch (error) {
    console.error("Error during deployment:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });