// deploy/00_deploy_your_contract.js

const { ethers, network } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("YourContract", {
    from: deployer,
    args: ["Dr. Milos", "controller", "Hospital 1"],
    log: true,
    waitConfirmations: 1,
  });
};
module.exports.tags = ["YourContract"];
