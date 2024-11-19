const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HelloWorld Contract", function () {
  let HelloWorld;
  let helloWorld;
  let owner;

  // Deploy the contract before each test
  beforeEach(async function () {
    // Get the ContractFactory and Signers
    HelloWorld = await ethers.getContractFactory("HelloWorld");
    [owner] = await ethers.getSigners();

    // Deploy the contract and wait for it to be deployed
    helloWorld = await HelloWorld.deploy();
    //await helloWorld.deployed(); // Ensure the contract is deployed
  });

  it("should deploy the contract and set initial greeting", async function () {
    // Check the initial greeting value
    const greeting = await helloWorld.getGreeting();
    expect(greeting).to.equal("Hello World!");
  });

  it("should update the greeting correctly", async function () {
    // Update the greeting
    const newGreeting = "Hello Hardhat!";
    await helloWorld.setGreeting(newGreeting);

    // Retrieve the updated greeting
    const updatedGreeting = await helloWorld.getGreeting();
    expect(updatedGreeting).to.equal(newGreeting);
  });

  it("should allow only the owner to change the greeting", async function () {
    const newGreeting = "Hello Ethereum!";
    
    // Try to change the greeting as the owner
    await helloWorld.setGreeting(newGreeting);

    // Ensure the greeting has been updated
    const updatedGreeting = await helloWorld.getGreeting();
    expect(updatedGreeting).to.equal(newGreeting);
  });
});