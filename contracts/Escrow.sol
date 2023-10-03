// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

contract Factory{
	address[] public deployedEscrows;
	function createEscrow(address _arbiter, address _beneficiary) public{
		Escrow newEscrow = new Escrow(_arbiter, _beneficiary, msg.sender);
		deployedEscrows.push(address(newEscrow));
	}

	function getDeployedEscrows() public view returns(address[] memory){
		return deployedEscrows;
	}
}

contract Escrow {
	address public arbiter;
	address public beneficiary;
	address public depositor;
	bool public isApproved;

	constructor(address _arbiter, address _beneficiary, address _owner) {
		arbiter = _arbiter;
		beneficiary = _beneficiary;
		depositor = _owner;
	}

	function makePayment() public payable {
		require(depositor == msg.sender , "Only the depositor or Owner can make payment to the contract");
	}

	event Approved(uint);

	function approve() external {
		require(msg.sender == arbiter, "Only the arbiter can approve the transaction");
		uint balance = address(this).balance;
		(bool sent, ) = payable(beneficiary).call{value: balance}("");
 		require(sent, "Failed to send Ether");
		emit Approved(balance);
		isApproved = true;
	}
}
