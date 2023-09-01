"use strict"

const BN = require("bn.js");

const ProtoCoin = artifacts.require("ProtoCoin");
const DECIMALS = new BN(18);

contract('ProtoCoin', function (accounts) {

  beforeEach(async () => {
    contract = await ProtoCoin.new();
  });

  it("Should has correct name", async () => {
    const name = await contract.name();
    assert(name === "ProtoCoin", "Incorrect name.");
  });

  it("Should has correct symbol", async () => {
    const symbol = await contract.symbol();
    assert(symbol === "PRC", "Incorrect symbol.");
  });

  it("Should has correct decimals", async () => {
    const decimals = await contract.decimals();
    assert(DECIMALS.eq(decimals), "Incorrect decimals.");
  });

  it("Should has correct totalSupply", async () => {
    const TOTAL_SUPPLY = new BN(1000).mul(new BN(10).pow(new BN(DECIMALS)));
    const totalSupply = await contract.totalSupply();
    assert(totalSupply.eq(TOTAL_SUPPLY), "Incorrect totalSupply.");
  });

  it("Owner should has the totalSupply", async () => {
    const TOTAL_SUPPLY = new BN(1000).mul(new BN(10).pow(new BN(DECIMALS)));
    const balance = await contract.balanceOf(accounts[0]);
    assert(balance.eq(TOTAL_SUPPLY), "Incorrect balance.");
  });

  it("Should transfer", async () => {
    const qty = new BN(1).mul(new BN(10).pow(new BN(DECIMALS)));

    const balanceAdminBefore = await contract.balanceOf(accounts[0]);
    const balanceToBefore = await contract.balanceOf(accounts[1]);

    await contract.transfer(accounts[1], qty);

    const balanceAdminNow = await contract.balanceOf(accounts[0]);
    const balanceToNow = await contract.balanceOf(accounts[1]);

    assert(
      new BN(balanceAdminNow).eq(new BN(balanceAdminBefore).sub(new BN(qty))),
      "Incorrect admin balance."
    );
    assert(
      new BN(balanceToNow).eq(new BN(balanceToBefore).add(new BN(qty))),
      "Incorrect to balance."
    );
  });

  it("Should NOT transfer", async () => {
    const qty = new BN(1001).mul(new BN(10).pow(new BN(DECIMALS)));

    try {
      await contract.transfer(accounts[1], qty);
      assert.fail("The transfer should have thrown an error.");
    } catch (error) {
      assert.include(
        error.message,
        "revert",
        "The transfer should be reverted."
      );
    }
  });


  it("Should approve", async () => {
    const qty = new BN(1).mul(new BN(10).pow(new BN(DECIMALS)));

    await contract.approve(accounts[1], qty);

    const allowance = await contract.allowance(accounts[0], accounts[1]);

    assert(new BN(allowance).eq(new BN(qty)), "Incorrect allowance balance.");
  });


  it("Should transfer from", async () => {
    const qty = new BN(1).mul(new BN(10).pow(new BN(DECIMALS)));

    const allowanceBefore = await contract.allowance(accounts[0], accounts[1]);
    const balanceAdminBefore = await contract.balanceOf(accounts[0]);
    const balanceToBefore = await contract.balanceOf(accounts[1]);

    await contract.approve(accounts[1], qty);
    await contract.transferFrom(accounts[0], accounts[1], qty, { from: accounts[1] });

    const allowanceNow = await contract.allowance(accounts[0], accounts[1]);
    const balanceAdminNow = await contract.balanceOf(accounts[0]);
    const balanceToNow = await contract.balanceOf(accounts[1]);

    assert(new BN(allowanceNow).eq(new BN(allowanceBefore)), "Incorrect allowance.");
    assert(
      new BN(balanceAdminNow).eq(new BN(balanceAdminBefore).sub(new BN(qty))),
      "Incorrect admin balance."
    );
    assert(
      new BN(balanceToNow).eq(new BN(balanceToBefore).add(new BN(qty))),
      "Incorrect to balance."
    );
  });


  it("Should NOT transfer from", async () => {
    const qty = new BN(1).mul(new BN(10).pow(new BN(DECIMALS)));

    try {
      await contract.transferFrom(accounts[0], accounts[1], qty, { from: accounts[1] });
      assert.fail("The transferFrom should have thrown an error.");
    } catch (error) {
      assert.include(
        error.message,
        "revert",
        "The transferFrom should be reverted."
      );
    }
  });

});
