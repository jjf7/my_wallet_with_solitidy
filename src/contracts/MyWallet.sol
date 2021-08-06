// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract MyWallet is ERC20{

    constructor() ERC20("Mock Dai","mDai") public { 
        // Mint 1.000.000 Dai to Deployer of the smart contract
        _mint(msg.sender, 1000000000000000000000000);
    }

}