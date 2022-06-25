// function deployFunc() {
// console.log("HY")
// }
// module.exports.default=deployFunc;
const { getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig, developmentChains, developmentChain } = require("../helper-hardhat-config")
const {verify}= require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUsdPriceFeedAddress;
    if (chainId == 31337) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    log("----------------------------------------------------")





const args=[ethUsdPriceFeedAddress];


    log("Deploying FundMe and waiting for confirmations...")

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
        waitConfirmations:network.config.blockConfirmations || 1,
    })
    if(!developmentChain.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        await verify(fundMe.address,args)
    }
    log("-------------------------------------------------");
}

module.exports.tags = ["all", "fundme"]