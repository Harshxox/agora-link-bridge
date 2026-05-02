import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AgoraVaultModule = buildModule("AgoraVaultModule", (m) => {
  // This tells Hardhat to deploy the AgoraVault contract
  const vault = m.contract("AgoraVault");

  return { vault };
});

export default AgoraVaultModule;s