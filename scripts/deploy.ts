import { network } from "hardhat";

async function main() {
  const connection = await network.connect("arc");
  const ethers = connection.ethers;

  const [deployer] = await ethers.getSigners();
  console.log("Deploying from:", deployer.address);

  const usdcAddress = "0x3600000000000000000000000000000000000000";
  const feeWallet   = deployer.address; // your wallet receives fees
  const feeBps      = 50;               // 0.5%

  const ArcOTC = await ethers.getContractFactory("ArcOTC", deployer);
  const arcotc = await ArcOTC.deploy(usdcAddress, feeWallet, feeBps);
  await arcotc.waitForDeployment();

  const address = await arcotc.getAddress();
  console.log("ArcOTC deployed to:", address);
  console.log("Fee wallet:", feeWallet);
  console.log("Fee:", feeBps / 100, "%");
  console.log("Explorer: https://testnet.arcscan.app/address/" + address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});