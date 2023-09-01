"use strict"

require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  plugins: ["truffle-plugin-verify"],
  api_keys: {
    etherscan: process.env.API_KEY_ETHERSCAN,
  },
  networks: {
    goerli: {
      provider: new HDWalletProvider({
        mnemonic: {
          phrase: process.env.SECRET_MNEMONIC,
        },
        providerOrUrl: process.env.INFURA_URL_GOERLI,
      }),
      network_id: "5",
    },
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777",
    },
  },
  compilers: {
    solc: {
      version: "0.8.17",
      settings: {
        optimizer: {
          enabled: true, // Default: false
          runs: 200      // Default: 200
        },
      }
    }
  }
};
