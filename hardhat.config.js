require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.6.6",
        settings: {
            optimizer: {
                enabled: true,
                runs: 10,
            }
        }
    },
    networks: {
        hardhat: {
            forking: {
                url: "https://eth-mainnet.alchemyapi.io/v2/demo"
            }
        }
    }
};
