// https://eth-goerli.g.alchemy.com/v2/MmZqC_oabc4XhdQeTPRrvih7VRfP2U2U

require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: "0.8.17",
	networks: {    
		goerli: {
			url: "https://eth-goerli.g.alchemy.com/v2/MmZqC_oabc4XhdQeTPRrvih7VRfP2U2U",
			accounts: [
				"dcd71c7763f8deed84c6ac01fac88b06448f2c093418d2b2f8826c82bdb84f61",
			],
		},
	},
};
