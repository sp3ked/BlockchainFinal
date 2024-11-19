async function main() {
    // Get the contract factory
    const HelloWorld = await ethers.getContractFactory("HelloWorld");
    
    // Deploy the contract
    const helloWorld = await HelloWorld.deploy();
    
    // Wait for deployment to finish
    await helloWorld.waitForDeployment();
    
    // Get the contract address
    const address = await helloWorld.getAddress();
    console.log("HelloWorld deployed to:", address);
  }
  
  // Handle errors
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });