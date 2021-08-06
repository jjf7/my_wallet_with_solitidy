const MyWallet = artifacts.require("MyWallet")

module.exports = (deployer) => {
    deployer.deploy(MyWallet)
}