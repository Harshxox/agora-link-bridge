import hre from "hardhat";

async function main() {
  console.log("--- Agora-Link: Manual Deployment Start ---");

  // In HH3, we can use the low-level deployer to bypass plugin injection issues
  const vault = await hre.ethers.deployContract("AgoraVault");

  console.log("Waiting for deployment...");
  await vault.waitForDeployment();

  const address = await vault.getAddress();
  
  console.log("----------------------------------------------");
  console.log("SUCCESS: AgoraVault is now live!");
  console.log("Contract Address:", address);
  console.log("----------------------------------------------");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});