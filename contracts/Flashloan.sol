pragma solidity =0.6.6;

import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Callee.sol';
import '@uniswap/v2-periphery/contracts/libraries/UniswapV2Library.sol';
import '@uniswap/v2-periphery/contracts/UniswapV2Router02.sol';
import '@uniswap/v2-periphery/contracts/interfaces/IERC20.sol';

import 'hardhat/console.sol';

contract Flashloan is IUniswapV2Callee {
    UniswapV2Router02 immutable router;

    constructor(address payable routerAddress) public {
        router = UniswapV2Router02(routerAddress);
    }

    function uniswapV2Call(address sender, uint amount0, uint amount1, bytes calldata data) external override {
        address token0 = IUniswapV2Pair(msg.sender).token0();
        address token1 = IUniswapV2Pair(msg.sender).token1();
        require(msg.sender == UniswapV2Library.pairFor(router.factory(), token0, token1), "Must be called from appropriate pair");

        uint amount;
        address tokenAddress;
        if (amount0 != 0 && amount1 == 0) {
            amount = amount0;
            tokenAddress = token0;
        } else if (amount0 == 0 && amount1 != 0) {
            amount = amount1;
            tokenAddress = token1;
        } else {
            revert("Only one amount must be non-zero");
        }

        address[] memory path = decodeData(data);
        require(path[0] == tokenAddress, "Path must start from appropriate token");
        require(path[0] == path[path.length - 1], "Path must be cyclic");

        IERC20(path[0]).approve(address(router), amount);
        uint[] memory amounts = router.swapExactTokensForTokens(
            amount,
            0,
            path,
            address(this),
            block.timestamp + 1 days
        );

        IERC20(tokenAddress).transfer(msg.sender, (amount * 1004) / 1000);
    }

    function encodeData(address[] memory path) public pure returns (bytes memory) {
        return abi.encode(path);
    }

    function decodeData(bytes memory data) public pure returns (address[] memory path) {
        return abi.decode(data, (address[]));
    }
}

/*
    МЫ ДЕЛИЛИ АПЕЛЬСИН
    мНОГО НАС.
    -- А ОН ОЩДИН. КОНЕЦ.
*/
