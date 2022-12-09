const {expect} = require("chai");
const {ethers} = require("hardhat");
const {reverted} = require("@nomicfoundation/hardhat-chai-matchers")

const IUniswapV2Factory = require("@uniswap/v2-core/build/IUniswapV2Factory.json");
const IUniswapV2Router02 = require("@uniswap/v2-periphery/build/IUniswapV2Router02.json");
const IUniswapV2Pair = require("@uniswap/v2-core/build/IUniswapV2Pair.json");
const WETH = require("@uniswap/v2-periphery/build/WETH9.json");


describe("Flashloan", function () {
    const oneETH = ethers.utils.parseEther("1")
    const twoETH = ethers.utils.parseEther("2")

    const UniswapV2FactoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
    const UniswapV2Router02Address = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

    const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    const USDTAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"
    const LINKAddress = "0x514910771AF9Ca656af840dff83E8264EcF986CA"
    const WETHAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    const path = [WETHAddress, LINKAddress, USDCAddress, WETHAddress]

    let uniswapFactory
    let uniswapRouter

    let flashloan;

    let owner;
    let addrs;

    let weth // WETH token contract
    let usdc // USDC token contract

    describe("Uniswap", function () {
        it("Should cycle swap", async function () {
            [owner, ...addrs] = await ethers.getSigners();

            const flashloanFactory = await ethers.getContractFactory("Flashloan");
            flashloan = await flashloanFactory.deploy(UniswapV2Router02Address);
            await flashloan.deployed();

            uniswapFactory = new ethers.Contract(UniswapV2FactoryAddress, IUniswapV2Factory.abi, owner)
            uniswapRouter = new ethers.Contract(UniswapV2Router02Address, IUniswapV2Router02.abi, owner)
            weth = new ethers.Contract(WETHAddress, WETH.abi, owner)

            await expect(weth.deposit({value: twoETH})).not.to.be.reverted
            expect(await weth.balanceOf(owner.address)).equal(twoETH)
            expect(await weth.transfer(flashloan.address, oneETH))

            const usdtToWethPairAddress = await uniswapFactory.getPair(USDTAddress, WETHAddress)
            const usdtToWethPair = new ethers.Contract(usdtToWethPairAddress, IUniswapV2Pair.abi, owner)
            const data = await flashloan.encodeData(path)
            await expect(usdtToWethPair.swap(oneETH, 0, flashloan.address, data)).not.to.be.reverted
        })
    })
});
