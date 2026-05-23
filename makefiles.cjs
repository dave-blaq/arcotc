const fs = require('fs');

const contract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract Escrow {
    address public depositor;
    address public beneficiary;
    address public arbiter;
    IERC20 public usdc;
    uint256 public amount;
    bool public isDeposited;
    bool public isReleased;
    bool public isRefunded;

    event Deposited(address indexed depositor, uint256 amount);
    event Released(address indexed beneficiary, uint256 amount);
    event Refunded(address indexed depositor, uint256 amount);

    constructor(address _beneficiary, address _arbiter, address _usdcAddress) {
        depositor = msg.sender;
        beneficiary = _beneficiary;
        arbiter = _arbiter;
        usdc = IERC20(_usdcAddress);
    }

    function deposit(uint256 _amount) external {
        require(msg.sender == depositor, "Only depositor");
        require(!isDeposited, "Already deposited");
        require(_amount > 0, "Amount must be > 0");
        bool success = usdc.transferFrom(msg.sender, address(this), _amount);
        require(success, "Transfer failed");
        amount = _amount;
        isDeposited = true;
        emit Deposited(msg.sender, _amount);
    }

    function release() external {
        require(msg.sender == arbiter, "Only arbiter");
        require(isDeposited, "Nothing deposited");
        require(!isReleased && !isRefunded, "Already settled");
        isReleased = true;
        bool success = usdc.transfer(beneficiary, amount);
        require(success, "Transfer failed");
        emit Released(beneficiary, amount);
    }

    function refund() external {
        require(msg.sender == arbiter, "Only arbiter");
        require(isDeposited, "Nothing deposited");
        require(!isReleased && !isRefunded, "Already settled");
        isRefunded = true;
        bool success = usdc.transfer(depositor, amount);
        require(success, "Transfer failed");
        emit Refunded(depositor, amount);
    }

    function getBalance() external view returns (uint256) {
        return usdc.balanceOf(address(this));
    }
}`;

const deploy = `import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying from:", deployer.address);

  const beneficiary = deployer.address;
  const arbiter = deployer.address;
  const usdcAddress = "0x3600000000000000000000000000000000000000";

  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy(beneficiary, arbiter, usdcAddress);

  await escrow.waitForDeployment();

  const address = await escrow.getAddress();
  console.log("Escrow deployed to:", address);
  console.log("View on explorer: https://testnet.arcscan.app/address/" + address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});`;

fs.writeFileSync('contracts/Escrow.sol', contract);
fs.writeFileSync('scripts/deploy.ts', deploy);
console.log('Done! Both files created.');