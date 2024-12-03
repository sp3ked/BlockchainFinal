const { ethers } = require("ethers"); //testign 

async function main() {
    const wallet = ethers.Wallet.createRandom();
    console.log("New Wallet Generated");
    console.log("Address:", wallet.address);
    console.log("Private Key:", wallet.privateKey);
    console.log("\nIMPORTANT: Save these credentials securely and never commit them to version control!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });