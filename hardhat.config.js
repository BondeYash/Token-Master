require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.17",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL, // Infura or Alchemy RPC URL
      accounts: [process.env.PRIVATE_KEY], // Your wallet private key
    },
  },
};
