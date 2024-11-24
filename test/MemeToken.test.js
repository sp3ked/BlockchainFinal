const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MemeToken", function () {
  let MemeToken;
  let memeToken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get the contract factory and signers
    MemeToken = await ethers.getContractFactory("MemeToken");
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy a new MemeToken contract for each test
    memeToken = await MemeToken.deploy();
    await memeToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner balance", async function () {
      const totalSupply = await memeToken.totalSupply();
      const ownerBalance = await memeToken.balanceOf(owner.address);
      expect(ownerBalance).to.equal(totalSupply);
    });

    it("Should set the correct token name and symbol", async function () {
      expect(await memeToken.name()).to.equal("MemeToken");
      expect(await memeToken.symbol()).to.equal("MEME");
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await memeToken.transfer(addr1.address, 50);
      expect(await memeToken.balanceOf(addr1.address)).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      await memeToken.connect(addr1).transfer(addr2.address, 50);
      expect(await memeToken.balanceOf(addr2.address)).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      // Try to send 1 token from addr1 (who has 0 tokens)
      await expect(
        memeToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("Insufficient balance");
    });

    it("Should update allowances correctly", async function () {
      await memeToken.approve(addr1.address, 100);
      expect(await memeToken.allowance(owner.address, addr1.address)).to.equal(100);
    });

    it("Should fail when transferring more than allowed", async function () {
      await memeToken.approve(addr1.address, 50);
      await expect(
        memeToken.connect(addr1).transferFrom(owner.address, addr2.address, 100)
      ).to.be.revertedWith("Insufficient allowance");
    });
  });
});