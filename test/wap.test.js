const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

const {  upgrades, ethers } = require("hardhat");


describe("test", function () {


  async function deploy() {


      // Contracts are deployed using the first signer/account by default
      const [owner, otherAccount, otherAccount_2] = await ethers.getSigners();
  
      const swap = await ethers.getContractFactory("Swap");
      const _swap = await swap.deploy();


      return {owner, otherAccount, _swap};

  }


  describe("Simple Swap", function () {


      it("Simple Swap two token", async function () {

        const {owner, otherAccount,_swap} = await loadFixture(deploy);

        const ADDRESS_IMPERSONATE = "0x88dfc989a1Fe3061065E33E6b8F8541f8405dFD5"

        const ADDRESS_DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

        const LINK_ADDRESS = '0x514910771AF9Ca656af840dff83E8264EcF986CA'

        const DAI = await ethers.getContractAt('@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20', ADDRESS_DAI);

        const LINK = await ethers.getContractAt('@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20', LINK_ADDRESS);

        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [ADDRESS_IMPERSONATE],
          });
          
        const SIGNER_IMPERSONATE = await ethers.getSigner(ADDRESS_IMPERSONATE)

        let ethAmount = String(ethers.parseEther("1"))

        
        let balanceInitial_dai = await DAI.connect(owner).balanceOf(SIGNER_IMPERSONATE.address);
        let balanceInitial_link = await LINK.connect(owner).balanceOf(SIGNER_IMPERSONATE.address);

        const distribution = [30,70]; // 30% and 70%
        const tokens = [ADDRESS_DAI,LINK_ADDRESS];

        //let tx = await DAI.connect(SIGNER_IMPERSONATE).balanceOf(SIGNER_IMPERSONATE.address);


        tx = await _swap.connect(SIGNER_IMPERSONATE).swap(tokens,distribution,{ value: ethAmount });

        let balanceFinal_dai = await DAI.connect(owner).balanceOf(SIGNER_IMPERSONATE.address);
        let balanceFinal_link = await LINK.connect(owner).balanceOf(SIGNER_IMPERSONATE.address);

        expect(balanceInitial_dai).to.be.not.equal(balanceFinal_dai);
        expect(balanceInitial_link).to.be.not.equal(balanceFinal_link);



      });

  });

});

