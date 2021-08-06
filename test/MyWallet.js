const MyWallet = artifacts.require("MyWallet")

contract('Testing MyWallet', (accounts) => {

    
    before ( async ()=> {
       this.myWallet = await MyWallet.deployed()
    })

    describe('Compile succefully' , ()=> {

        it ('testing compile', async ()=> {
            const name = await this.myWallet.name();
            const symbol = await this.myWallet.symbol();
            const amount = await this.myWallet.balanceOf(accounts[0]);
            const value  = web3.utils.toWei('1000000','ether');
            assert.equal(name, 'Mock Dai')
            assert.equal(symbol, 'mDai')
            assert.equal(amount.toString(), value)
        })
    })
})