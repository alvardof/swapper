//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";


contract Swap {


    ISwapRouter public immutable swapRouter = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

    IWETH private weth = IWETH(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);

    address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

    uint24 public constant poolTax = 1000;


    address private addressee;
    // For this example, we will set the pool fee to 0.3%.

    uint24 public constant poolFee = 3000;

    uint256 private commission;

    uint256 private amount;


    

    constructor() {


        addressee = msg.sender;

    }

    function swap(address[] memory tokens, uint256[] memory distribution) payable external returns (uint256 amountOut) {


        commission = (msg.value / poolTax);

        amount = msg.value - commission;

        (bool sent_commission,) = addressee.call{value: (commission)}("");

        require(sent_commission,"payment of commission not made");

        for (uint256 i = 0; i < tokens.length; i++) {

        
            ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: WETH9,
                tokenOut: tokens[i],
                fee: poolFee,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: (amount * distribution[i]) / 100,            
                amountOutMinimum: 1,
                sqrtPriceLimitX96: 0
            });
            
            // The call to `exactInputSingle` executes the swap.
            amountOut = swapRouter.exactInputSingle{ value: (amount * distribution[i]) / 100 }(params);

   
        }

        

        

    }


}


interface IWETH is IERC20 {
    function deposit() external payable;

    function withdraw(uint amount) external;
}