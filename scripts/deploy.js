const hre = require("hardhat");

async function main() {
  const crowdFunding = await hre.ethers.deployContract("CrowdFunding");

  const crowdFundingD = await crowdFunding.waitForDeployment();
  console.log("Deployed contract===>>>", crowdFundingD);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
